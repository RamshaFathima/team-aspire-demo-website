import { Op } from 'sequelize';
import Course from '../../../models/course.model';
import CourseModule from '../../../models/course.module.model';
import Lesson from '../../../models/lesson.model';
import Cohort from '../../../models/cohort.model';
import Enrollment from '../../../models/enrollment.model';
import ClassSession from '../../../models/class.session.model';
import Attendance from '../../../models/attendance.model';
import TeachingAssignment from '../../../models/teaching.assignment.model';
import User from '../../../models/user.model';
import Notification from '../../../models/notification.model';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';
import { slugify } from '../../../utils/Ids';
import { ensureContact, logInteraction } from '../../../utils/CrmUtil';
import { IUserContext } from '../../../middlewares/permission.middleware';

const studentAttrs = ['id', 'fullName', 'email'];

class LmsService {
    /** Teachers without cohort-manage rights may only touch cohorts they teach. */
    private async assertCohortAccess(userCtx: IUserContext, cohortId: string) {
        if (userCtx.permissions.includes('lms.cohorts.manage')) return;
        const assignment = await TeachingAssignment.findOne({
            where: { teacherId: userCtx.id, cohortId },
        });
        if (!assignment) {
            throw new ValidationError('You are not assigned to this cohort', StatusCodes.ALREADY_EXISTS);
        }
    }

    private async teacherCohortIds(userCtx: IUserContext): Promise<string[] | null> {
        if (userCtx.permissions.includes('lms.cohorts.manage')) return null; // unrestricted
        const mine = await TeachingAssignment.findAll({ where: { teacherId: userCtx.id } });
        return mine.map((m) => m.cohortId);
    }

    // ── Courses ──────────────────────────────────────────────────
    async listCourses(query: { page?: number; limit?: number; search?: string; status?: string }) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
        const where: any = {};
        if (query.status) where.status = query.status;
        if (query.search) where.title = { [Op.iLike]: `%${query.search}%` };

        const { rows, count } = await Course.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });
        return { data: rows, page, limit, total: count };
    }

    async getCourse(id: string) {
        const course = await Course.findByPk(id, {
            include: [
                { model: CourseModule, include: [Lesson] },
                { model: Cohort },
            ],
            order: [
                [{ model: CourseModule, as: 'modules' }, 'position', 'ASC'],
                [{ model: CourseModule, as: 'modules' }, { model: Lesson, as: 'lessons' }, 'position', 'ASC'],
            ],
        });
        if (!course) throw new ValidationError('Course not found', StatusCodes.NOT_FOUND);
        return course;
    }

    async createCourse(data: any, createdBy: string) {
        const slug = slugify(data.slug || data.title);
        if (await Course.findOne({ where: { slug } })) {
            throw new ValidationError(`Slug "${slug}" already used`, StatusCodes.CONFLICT);
        }
        return Course.create({ ...data, slug, createdBy } as any);
    }

    async updateCourse(id: string, data: any) {
        const course = await Course.findByPk(id);
        if (!course) throw new ValidationError('Course not found', StatusCodes.NOT_FOUND);
        const patch = { ...data };
        if (data.slug) patch.slug = slugify(data.slug);
        await course.update(patch);
        return course;
    }

    async setCourseStatus(id: string, status: string) {
        const course = await Course.findByPk(id);
        if (!course) throw new ValidationError('Course not found', StatusCodes.NOT_FOUND);
        await course.update({
            status,
            publishedAt:
                status === 'published' && !course.publishedAt ? new Date() : course.publishedAt,
        });
        return course;
    }

    async addModule(courseId: string, data: { title: string; position?: number }) {
        if (!(await Course.findByPk(courseId))) {
            throw new ValidationError('Course not found', StatusCodes.NOT_FOUND);
        }
        return CourseModule.create({ courseId, title: data.title, position: data.position ?? 0 } as any);
    }

    async addLesson(moduleId: string, data: any) {
        if (!(await CourseModule.findByPk(moduleId))) {
            throw new ValidationError('Module not found', StatusCodes.NOT_FOUND);
        }
        return Lesson.create({ moduleId, ...data } as any);
    }

    async deleteModule(moduleId: string) {
        await CourseModule.destroy({ where: { id: moduleId } });
        return { ok: true };
    }

    async removeCourse(id: string) {
        const course = await Course.findByPk(id);
        if (!course) throw new ValidationError('Course not found', StatusCodes.NOT_FOUND);
        await course.destroy(); // cascades cohorts, sessions, enrollments, attendance
        return { ok: true, title: course.title };
    }

    async removeCohort(id: string) {
        const cohort = await Cohort.findByPk(id);
        if (!cohort) throw new ValidationError('Cohort not found', StatusCodes.NOT_FOUND);
        await cohort.destroy();
        return { ok: true, name: cohort.name };
    }

    async removeSession(userCtx: IUserContext, id: string) {
        const session = await ClassSession.findByPk(id);
        if (!session) throw new ValidationError('Session not found', StatusCodes.NOT_FOUND);
        await this.assertCohortAccess(userCtx, session.cohortId);
        await session.destroy();
        return { ok: true, title: session.title };
    }

    // ── Cohorts ──────────────────────────────────────────────────
    async listCohorts(userCtx: IUserContext, query: { courseId?: string; status?: string }) {
        const where: any = {};
        if (query.courseId) where.courseId = query.courseId;
        if (query.status) where.status = query.status;

        const restrictTo = await this.teacherCohortIds(userCtx);
        if (restrictTo) {
            if (!restrictTo.length) return { data: [] };
            where.id = restrictTo;
        }

        const cohorts = await Cohort.findAll({
            where,
            include: [
                { model: Course, attributes: ['id', 'title', 'slug'] },
                { model: Enrollment, attributes: ['id'] },
            ],
            order: [['createdAt', 'DESC']],
        });
        return {
            data: cohorts.map((c) => ({
                ...c.get({ plain: true }),
                courseTitle: c.course?.title,
                enrolled: c.enrollments?.length ?? 0,
                enrollments: undefined,
                course: undefined,
            })),
        };
    }

    async createCohort(data: any) {
        const course = await Course.findByPk(data.courseId);
        if (!course) throw new ValidationError('Course not found', StatusCodes.NOT_FOUND);
        const code =
            data.code ??
            `${course.slug.toUpperCase().slice(0, 12)}-${new Date().getFullYear()}-${Math.random()
                .toString(36)
                .slice(2, 5)
                .toUpperCase()}`;
        if (await Cohort.findOne({ where: { code } })) {
            throw new ValidationError(`Cohort code "${code}" already used`, StatusCodes.CONFLICT);
        }
        return Cohort.create({ ...data, code } as any);
    }

    async updateCohort(id: string, data: any) {
        const cohort = await Cohort.findByPk(id);
        if (!cohort) throw new ValidationError('Cohort not found', StatusCodes.NOT_FOUND);
        await cohort.update(data);
        return cohort;
    }

    async getCohort(id: string) {
        const cohort = await Cohort.findByPk(id, {
            include: [
                { model: Course, attributes: ['id', 'title', 'slug', 'minAttendancePct', 'certificateEnabled'] },
                { model: Enrollment, include: [{ model: User, attributes: studentAttrs }] },
                { model: ClassSession },
            ],
            order: [[{ model: ClassSession, as: 'sessions' }, 'startsAt', 'ASC']],
        });
        if (!cohort) throw new ValidationError('Cohort not found', StatusCodes.NOT_FOUND);

        const teachers = await TeachingAssignment.findAll({
            where: { cohortId: id },
            include: [{ model: User, attributes: studentAttrs }],
        });

        const plain = cohort.get({ plain: true }) as any;
        return {
            ...plain,
            courseTitle: plain.course?.title,
            enrollments: (plain.enrollments ?? []).map((e: any) => ({
                ...e,
                studentName: e.user?.fullName,
                studentEmail: e.user?.email,
                user: undefined,
            })),
            teachers: teachers.map((t) => ({
                id: t.id,
                teacherId: t.teacherId,
                role: t.role,
                teacherName: t.teacher?.fullName,
            })),
        };
    }

    async assignTeacher(cohortId: string, teacherId: string, role: string) {
        if (!(await Cohort.findByPk(cohortId))) {
            throw new ValidationError('Cohort not found', StatusCodes.NOT_FOUND);
        }
        const existing = await TeachingAssignment.findOne({ where: { cohortId, teacherId } });
        if (existing) throw new ValidationError('Teacher already assigned', StatusCodes.CONFLICT);
        return TeachingAssignment.create({ cohortId, teacherId, role } as any);
    }

    // ── Enrollments ──────────────────────────────────────────────
    async enroll(cohortId: string, userId: string, actorId: string | null, selfService = false) {
        const cohort = await Cohort.findByPk(cohortId, { include: [Course] });
        if (!cohort) throw new ValidationError('Cohort not found', StatusCodes.NOT_FOUND);

        if (selfService) {
            if (!['upcoming', 'active'].includes(cohort.status)) {
                throw new ValidationError('This batch is not open for enrollment');
            }
            if (cohort.course?.status !== 'published') {
                throw new ValidationError('Course is not open for enrollment');
            }
        }

        const existing = await Enrollment.findOne({ where: { cohortId, userId } });
        if (existing) {
            throw new ValidationError('Student already enrolled in this batch', StatusCodes.CONFLICT);
        }

        if (cohort.capacity) {
            const current = await Enrollment.count({ where: { cohortId } });
            if (current >= cohort.capacity) throw new ValidationError('This batch is full');
        }

        const enrollment = await Enrollment.create({
            userId,
            cohortId,
            courseId: cohort.courseId,
            status: 'active',
        } as any);

        const student = await User.findByPk(userId);
        if (student) {
            const contactId = await ensureContact({
                userId: student.id,
                fullName: student.fullName,
                email: student.email,
                type: 'student',
            });
            await logInteraction({
                contactId,
                kind: 'enrollment',
                subject: `Enrolled in ${cohort.course?.title ?? 'course'} (${cohort.name})`,
                createdBy: actorId,
            });
            await Notification.create({
                userId: student.id,
                type: 'enrollment.confirmed',
                title: 'Enrollment confirmed',
                body: `You are enrolled in ${cohort.course?.title} — ${cohort.name}. ${cohort.scheduleNote ?? ''}`.trim(),
            } as any);
        }
        return enrollment;
    }

    async updateEnrollment(id: string, data: { status?: string; progress?: number }) {
        const enrollment = await Enrollment.findByPk(id);
        if (!enrollment) throw new ValidationError('Enrollment not found', StatusCodes.NOT_FOUND);
        const patch: any = { ...data };
        if (data.status === 'completed') patch.completedAt = new Date();
        await enrollment.update(patch);
        return enrollment;
    }

    // ── Class sessions ───────────────────────────────────────────
    async listSessions(userCtx: IUserContext, query: { cohortId?: string; status?: string }) {
        const where: any = {};
        if (query.cohortId) where.cohortId = query.cohortId;
        if (query.status) where.status = query.status;

        const restrictTo = await this.teacherCohortIds(userCtx);
        if (restrictTo) {
            if (!restrictTo.length) return { data: [] };
            where.cohortId = query.cohortId
                ? restrictTo.includes(query.cohortId)
                    ? query.cohortId
                    : '00000000-0000-0000-0000-000000000000'
                : restrictTo;
        }

        const sessions = await ClassSession.findAll({
            where,
            include: [{ model: Cohort, include: [{ model: Course, attributes: ['id', 'title'] }] }],
            order: [['startsAt', 'DESC']],
            limit: 100,
        });
        return {
            data: sessions.map((s) => ({
                ...s.get({ plain: true }),
                cohortName: s.cohort?.name,
                courseTitle: s.cohort?.course?.title,
                cohort: undefined,
            })),
        };
    }

    async createSession(data: any) {
        if (!(await Cohort.findByPk(data.cohortId))) {
            throw new ValidationError('Cohort not found', StatusCodes.NOT_FOUND);
        }
        return ClassSession.create(data);
    }

    async updateSession(userCtx: IUserContext, id: string, data: any) {
        const session = await ClassSession.findByPk(id);
        if (!session) throw new ValidationError('Session not found', StatusCodes.NOT_FOUND);
        await this.assertCohortAccess(userCtx, session.cohortId);
        await session.update(data);
        return session;
    }

    // ── Attendance ───────────────────────────────────────────────
    async getAttendance(userCtx: IUserContext, sessionId: string) {
        const session = await ClassSession.findByPk(sessionId);
        if (!session) throw new ValidationError('Session not found', StatusCodes.NOT_FOUND);
        await this.assertCohortAccess(userCtx, session.cohortId);

        const roster = await Enrollment.findAll({
            where: { cohortId: session.cohortId, status: ['active', 'completed'] },
            include: [{ model: User, attributes: studentAttrs }],
        });
        const marks = await Attendance.findAll({ where: { sessionId } });
        const markMap = new Map(marks.map((m) => [m.studentId, m]));

        return {
            session,
            roster: roster
                .map((e) => ({
                    userId: e.userId,
                    name: e.user?.fullName,
                    email: e.user?.email,
                    status: markMap.get(e.userId)?.status ?? null,
                    markedAt: markMap.get(e.userId)?.markedAt ?? null,
                }))
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')),
        };
    }

    async markAttendance(
        userCtx: IUserContext,
        sessionId: string,
        marks: { studentId: string; status: string }[]
    ) {
        const session = await ClassSession.findByPk(sessionId);
        if (!session) throw new ValidationError('Session not found', StatusCodes.NOT_FOUND);
        await this.assertCohortAccess(userCtx, session.cohortId);

        const roster = await Enrollment.findAll({ where: { cohortId: session.cohortId } });
        const rosterSet = new Set(roster.map((r) => r.userId));
        const invalid = marks.find((m) => !rosterSet.has(m.studentId));
        if (invalid) {
            throw new ValidationError(`Student ${invalid.studentId} is not enrolled in this cohort`);
        }

        const now = new Date();
        for (const mark of marks) {
            const existing = await Attendance.findOne({
                where: { sessionId, studentId: mark.studentId },
            });
            if (existing) {
                await existing.update({ status: mark.status, markedBy: userCtx.id, markedAt: now });
            } else {
                await Attendance.create({
                    sessionId,
                    studentId: mark.studentId,
                    status: mark.status,
                    markedBy: userCtx.id,
                    markedAt: now,
                } as any);
            }
        }
        return { ok: true, marked: marks.length };
    }
}

export default new LmsService();
