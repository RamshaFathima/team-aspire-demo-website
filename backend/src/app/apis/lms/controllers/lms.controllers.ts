import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import lmsService from '../services/lms.service';
import { audit } from '../../../utils/AuditUtil';

type IdParams = { id: string };

const idPath = () => {
    const payload = new RequestBuilder();
    payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
    return payload;
};

const courseBodySchema = {
    title: Joi.string().min(3).max(160),
    slug: Joi.string().max(160),
    summary: Joi.string().max(600).allow(null, ''),
    description: Joi.string().allow(null, ''),
    category: Joi.string().max(60).allow(null, ''),
    level: Joi.string().max(30).allow(null, ''),
    coverImage: Joi.string().uri().allow(null, ''),
    durationWeeks: Joi.number().integer().positive().allow(null),
    capacity: Joi.number().integer().positive().allow(null),
    isOnline: Joi.boolean(),
    meetingPlatform: Joi.string().max(60).allow(null, ''),
    certificateEnabled: Joi.boolean(),
    minAttendancePct: Joi.number().integer().min(0).max(100).allow(null),
};

// ── Courses ──────────────────────────────────────────────────────

export class ListCoursesController extends MasterController<null, any, null> {
    static doc() {
        return { tags: ['LMS'], summary: 'List courses (admin)', description: 'Paginated courses' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                page: Joi.number().integer().min(1).optional(),
                limit: Joi.number().integer().min(1).max(100).optional(),
                search: Joi.string().max(120).optional(),
                status: Joi.string().valid('draft', 'review', 'published', 'archived').optional(),
            })
        );
        return payload;
    }

    async restController(_params: null, query: any): Promise<ResponseBuilder> {
        const result = await lmsService.listCourses(query);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class GetCourseController extends MasterController<IdParams, null, null> {
    static doc() {
        return { tags: ['LMS'], summary: 'Get course', description: 'Course with curriculum + cohorts' };
    }

    public static validate(): RequestBuilder {
        return idPath();
    }

    async restController(params: IdParams): Promise<ResponseBuilder> {
        const course = await lmsService.getCourse(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, course, 'OK');
    }
}

export class CreateCourseController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Create course', description: 'New course (draft)' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({ ...courseBodySchema, title: courseBodySchema.title.required() })
        );
        return payload;
    }

    async restController(
        _params: null,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const course = await lmsService.createCourse(body, allData.userCtx.id);
        audit(allData, { action: 'course.create', resourceType: 'course', resourceId: course.id });
        return new ResponseBuilder(StatusCodes.CREATED, course, 'Course created');
    }
}

export class UpdateCourseController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Update course', description: 'Edit course fields' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(Joi.object().keys(courseBodySchema));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const course = await lmsService.updateCourse(params.id, body);
        audit(allData, { action: 'course.update', resourceType: 'course', resourceId: params.id });
        return new ResponseBuilder(StatusCodes.SUCCESS, course, 'Course updated');
    }
}

export class SetCourseStatusController extends MasterController<IdParams, null, { status: string }> {
    static doc() {
        return { tags: ['LMS'], summary: 'Set course status', description: 'Lifecycle: draft→review→published→archived' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(
            Joi.object().keys({
                status: Joi.string().valid('draft', 'review', 'published', 'archived').required(),
            })
        );
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: { status: string },
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const course = await lmsService.setCourseStatus(params.id, body.status);
        audit(allData, {
            action: 'course.status_change',
            resourceType: 'course',
            resourceId: params.id,
            metadata: { status: body.status },
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, course, 'Status updated');
    }
}

export class AddCourseModuleController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Add module', description: 'Add curriculum module to course' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(
            Joi.object().keys({
                title: Joi.string().min(2).max(160).required(),
                position: Joi.number().integer().min(0).default(0),
            })
        );
        return payload;
    }

    async restController(params: IdParams, _query: null, body: any): Promise<ResponseBuilder> {
        const mod = await lmsService.addModule(params.id, body);
        return new ResponseBuilder(StatusCodes.CREATED, mod, 'Module added');
    }
}

export class AddLessonController extends MasterController<{ moduleId: string }, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Add lesson', description: 'Add lesson to a module' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ moduleId: Joi.string().uuid().required() }));
        payload.addToBody(
            Joi.object().keys({
                title: Joi.string().min(2).max(160).required(),
                content: Joi.string().allow(null, '').optional(),
                materialUrl: Joi.string().uri().allow(null, '').optional(),
                position: Joi.number().integer().min(0).default(0),
            })
        );
        return payload;
    }

    async restController(params: { moduleId: string }, _query: null, body: any): Promise<ResponseBuilder> {
        const lesson = await lmsService.addLesson(params.moduleId, body);
        return new ResponseBuilder(StatusCodes.CREATED, lesson, 'Lesson added');
    }
}

export class DeleteModuleController extends MasterController<{ moduleId: string }, null, null> {
    static doc() {
        return { tags: ['LMS'], summary: 'Delete module', description: 'Remove module + lessons' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ moduleId: Joi.string().uuid().required() }));
        return payload;
    }

    async restController(params: { moduleId: string }): Promise<ResponseBuilder> {
        const result = await lmsService.deleteModule(params.moduleId);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Module deleted');
    }
}

// ── Cohorts ──────────────────────────────────────────────────────

const cohortBodySchema = {
    courseId: Joi.string().uuid(),
    name: Joi.string().min(2).max(120),
    code: Joi.string().min(2).max(60),
    startsOn: Joi.date().allow(null),
    endsOn: Joi.date().allow(null),
    scheduleNote: Joi.string().max(200).allow(null, ''),
    status: Joi.string().valid('upcoming', 'active', 'completed'),
    capacity: Joi.number().integer().positive().allow(null),
};

export class ListCohortsController extends MasterController<null, any, null> {
    static doc() {
        return { tags: ['LMS'], summary: 'List cohorts', description: 'Teacher-scoped cohort list' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                courseId: Joi.string().uuid().optional(),
                status: Joi.string().valid('upcoming', 'active', 'completed').optional(),
            })
        );
        return payload;
    }

    async restController(
        _params: null,
        query: any,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await lmsService.listCohorts(allData.userCtx, query);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class GetCohortController extends MasterController<IdParams, null, null> {
    static doc() {
        return { tags: ['LMS'], summary: 'Get cohort', description: 'Cohort with roster, sessions, teachers' };
    }

    public static validate(): RequestBuilder {
        return idPath();
    }

    async restController(params: IdParams): Promise<ResponseBuilder> {
        const cohort = await lmsService.getCohort(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, cohort, 'OK');
    }
}

export class CreateCohortController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Create cohort', description: 'New batch for a course' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                ...cohortBodySchema,
                courseId: cohortBodySchema.courseId.required(),
                name: cohortBodySchema.name.required(),
            })
        );
        return payload;
    }

    async restController(
        _params: null,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const cohort = await lmsService.createCohort(body);
        audit(allData, { action: 'cohort.create', resourceType: 'cohort', resourceId: cohort.id });
        return new ResponseBuilder(StatusCodes.CREATED, cohort, 'Cohort created');
    }
}

export class UpdateCohortController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Update cohort', description: 'Edit batch details' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        const { courseId: _omit, ...rest } = cohortBodySchema;
        payload.addToBody(Joi.object().keys(rest));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const cohort = await lmsService.updateCohort(params.id, body);
        audit(allData, { action: 'cohort.update', resourceType: 'cohort', resourceId: params.id });
        return new ResponseBuilder(StatusCodes.SUCCESS, cohort, 'Cohort updated');
    }
}

export class AssignTeacherController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Assign teacher', description: 'Attach teacher to cohort' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(
            Joi.object().keys({
                teacherId: Joi.string().uuid().required(),
                role: Joi.string().valid('instructor', 'assistant').default('instructor'),
            })
        );
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const assignment = await lmsService.assignTeacher(params.id, body.teacherId, body.role);
        audit(allData, {
            action: 'cohort.teacher_assigned',
            resourceType: 'cohort',
            resourceId: params.id,
            metadata: { teacherId: body.teacherId },
        });
        return new ResponseBuilder(StatusCodes.CREATED, assignment, 'Teacher assigned');
    }
}

// ── Enrollments ──────────────────────────────────────────────────

export class EnrollStudentController extends MasterController<IdParams, null, { userId: string }> {
    static doc() {
        return { tags: ['LMS'], summary: 'Enroll student', description: 'Admin enrolls a student into a cohort' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(Joi.object().keys({ userId: Joi.string().uuid().required() }));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: { userId: string },
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const enrollment = await lmsService.enroll(params.id, body.userId, allData.userCtx.id);
        audit(allData, {
            action: 'enrollment.create',
            resourceType: 'enrollment',
            resourceId: enrollment.id,
            metadata: { cohortId: params.id, userId: body.userId },
        });
        return new ResponseBuilder(StatusCodes.CREATED, enrollment, 'Student enrolled');
    }
}

export class UpdateEnrollmentController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Update enrollment', description: 'Change status/progress' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(
            Joi.object().keys({
                status: Joi.string().valid('pending', 'active', 'completed', 'dropped').optional(),
                progress: Joi.number().integer().min(0).max(100).optional(),
            })
        );
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const enrollment = await lmsService.updateEnrollment(params.id, body);
        audit(allData, {
            action: 'enrollment.update',
            resourceType: 'enrollment',
            resourceId: params.id,
            metadata: body,
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, enrollment, 'Enrollment updated');
    }
}

// ── Sessions & attendance ────────────────────────────────────────

export class ListSessionsController extends MasterController<null, any, null> {
    static doc() {
        return { tags: ['LMS'], summary: 'List class sessions', description: 'Teacher-scoped session list' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                cohortId: Joi.string().uuid().optional(),
                status: Joi.string().valid('scheduled', 'completed', 'cancelled').optional(),
            })
        );
        return payload;
    }

    async restController(
        _params: null,
        query: any,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await lmsService.listSessions(allData.userCtx, query);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class CreateSessionController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Schedule class', description: 'Create a class session' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                cohortId: Joi.string().uuid().required(),
                title: Joi.string().min(2).max(160).required(),
                topic: Joi.string().max(200).allow(null, '').optional(),
                startsAt: Joi.date().required(),
                endsAt: Joi.date().allow(null).optional(),
                location: Joi.string().max(160).allow(null, '').optional(),
                meetingUrl: Joi.string().uri().allow(null, '').optional(),
                teacherId: Joi.string().uuid().allow(null).optional(),
            })
        );
        return payload;
    }

    async restController(
        _params: null,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const session = await lmsService.createSession(body);
        audit(allData, { action: 'session.create', resourceType: 'class_session', resourceId: session.id });
        return new ResponseBuilder(StatusCodes.CREATED, session, 'Session scheduled');
    }
}

export class UpdateSessionController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Update class', description: 'Edit/cancel/complete a session' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(
            Joi.object().keys({
                title: Joi.string().min(2).max(160).optional(),
                topic: Joi.string().max(200).allow(null, '').optional(),
                startsAt: Joi.date().optional(),
                endsAt: Joi.date().allow(null).optional(),
                location: Joi.string().max(160).allow(null, '').optional(),
                meetingUrl: Joi.string().uri().allow(null, '').optional(),
                teacherId: Joi.string().uuid().allow(null).optional(),
                status: Joi.string().valid('scheduled', 'completed', 'cancelled').optional(),
            })
        );
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const session = await lmsService.updateSession(allData.userCtx, params.id, body);
        audit(allData, {
            action: 'session.update',
            resourceType: 'class_session',
            resourceId: params.id,
            metadata: body,
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, session, 'Session updated');
    }
}

export class GetAttendanceController extends MasterController<IdParams, null, null> {
    static doc() {
        return { tags: ['LMS'], summary: 'Attendance sheet', description: 'Roster + marks for a session' };
    }

    public static validate(): RequestBuilder {
        return idPath();
    }

    async restController(
        params: IdParams,
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const sheet = await lmsService.getAttendance(allData.userCtx, params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, sheet, 'OK');
    }
}

export class MarkAttendanceController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['LMS'], summary: 'Mark attendance', description: 'Bulk upsert marks for a session' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(
            Joi.object().keys({
                marks: Joi.array()
                    .items(
                        Joi.object().keys({
                            studentId: Joi.string().uuid().required(),
                            status: Joi.string()
                                .valid('present', 'absent', 'late', 'excused')
                                .required(),
                        })
                    )
                    .min(1)
                    .required(),
            })
        );
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await lmsService.markAttendance(allData.userCtx, params.id, body.marks);
        audit(allData, {
            action: 'attendance.mark',
            resourceType: 'class_session',
            resourceId: params.id,
            metadata: { count: body.marks.length },
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Attendance saved');
    }
}
