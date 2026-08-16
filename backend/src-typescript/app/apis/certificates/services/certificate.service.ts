import { Op } from 'sequelize';
import Certificate from '../../../models/certificate.model';
import User from '../../../models/user.model';
import Course from '../../../models/course.model';
import Cohort from '../../../models/cohort.model';
import ClassSession from '../../../models/class.session.model';
import Enrollment from '../../../models/enrollment.model';
import Attendance from '../../../models/attendance.model';
import TeachingAssignment from '../../../models/teaching.assignment.model';
import Notification from '../../../models/notification.model';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';
import { makeCertificateNumber, makeVerificationCode } from '../../../utils/Ids';
import { ensureContact, logInteraction } from '../../../utils/CrmUtil';

class CertificateService {
    async list(query: { page?: number; limit?: number; search?: string; status?: string }) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
        const where: any = {};
        if (query.status) where.status = query.status;
        if (query.search) {
            where[Op.or as any] = [
                { certificateNumber: { [Op.iLike]: `%${query.search}%` } },
                { title: { [Op.iLike]: `%${query.search}%` } },
            ];
        }

        const { rows, count } = await Certificate.findAndCountAll({
            where,
            include: [
                { model: User, attributes: ['id', 'fullName', 'email'] },
                { model: Course, attributes: ['id', 'title'] },
            ],
            order: [['issuedAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });
        return {
            data: rows.map((c) => ({
                ...c.get({ plain: true }),
                holderName: c.holder?.fullName,
                holderEmail: c.holder?.email,
                courseTitle: c.course?.title,
                holder: undefined,
                course: undefined,
            })),
            page,
            limit,
            total: count,
        };
    }

    async issue(
        data: {
            userId: string;
            courseId?: string | null;
            cohortId?: string | null;
            title: string;
            description?: string | null;
            expiresAt?: Date | null;
        },
        issuedBy: string
    ) {
        const holder = await User.findByPk(data.userId);
        if (!holder) throw new ValidationError('User not found', StatusCodes.NOT_FOUND);

        // One certificate per student per course — revoked ones must be reinstated instead.
        if (data.courseId) {
            const existing = await Certificate.findOne({
                where: { userId: data.userId, courseId: data.courseId },
            });
            if (existing?.status === 'active') {
                throw new ValidationError(
                    `${holder.fullName} already holds certificate ${existing.certificateNumber} for this course`,
                    StatusCodes.CONFLICT
                );
            }
            if (existing?.status === 'revoked') {
                throw new ValidationError(
                    `${holder.fullName} has a revoked certificate (${existing.certificateNumber}) for this course — reinstate it instead of issuing a new one`,
                    StatusCodes.CONFLICT
                );
            }
        }

        const certificate = await Certificate.create({
            ...data,
            certificateNumber: makeCertificateNumber(),
            verificationCode: makeVerificationCode(),
            issuedBy,
        } as any);

        const contactId = await ensureContact({
            userId: holder.id,
            fullName: holder.fullName,
            email: holder.email,
            type: 'student',
        });
        await logInteraction({
            contactId,
            kind: 'event',
            subject: `Certificate issued: ${certificate.title}`,
            detail: certificate.certificateNumber,
            createdBy: issuedBy,
        });
        await Notification.create({
            userId: holder.id,
            type: 'certificate.issued',
            title: 'Your certificate is ready',
            body: `${certificate.title} — verify with code ${certificate.verificationCode}`,
        } as any);

        return certificate;
    }

    async revoke(id: string, reason: string) {
        const certificate = await Certificate.findByPk(id);
        if (!certificate) throw new ValidationError('Certificate not found', StatusCodes.NOT_FOUND);
        if (certificate.status === 'revoked') {
            throw new ValidationError('Certificate is already revoked');
        }
        await certificate.update({ status: 'revoked', revokedReason: reason });
        return certificate;
    }

    /** Bring a revoked certificate back into force (same number & code). */
    async reinstate(id: string) {
        const certificate = await Certificate.findByPk(id);
        if (!certificate) throw new ValidationError('Certificate not found', StatusCodes.NOT_FOUND);
        if (certificate.status !== 'revoked') {
            throw new ValidationError('Only revoked certificates can be reinstated');
        }
        await certificate.update({ status: 'active', revokedReason: null });
        return certificate;
    }

    /** Attendance-based certificate eligibility for a cohort. */
    async eligibility(cohortId: string) {
        const cohort = await Cohort.findByPk(cohortId, { include: [Course] });
        if (!cohort) throw new ValidationError('Cohort not found', StatusCodes.NOT_FOUND);

        const sessions = await ClassSession.findAll({
            where: { cohortId, status: 'completed' },
            attributes: ['id'],
        });
        const sessionIds = sessions.map((s) => s.id);

        const roster = await Enrollment.findAll({
            where: { cohortId },
            include: [{ model: User, attributes: ['id', 'fullName'] }],
        });

        const existingCerts = await Certificate.findAll({
            where: {
                courseId: cohort.courseId,
                userId: { [Op.in]: roster.map((r) => r.userId) },
            },
        });
        const certByUser = new Map(existingCerts.map((c) => [c.userId, c]));

        const students = [];
        for (const enrollment of roster) {
            let attended = 0;
            if (sessionIds.length) {
                attended = await Attendance.count({
                    where: {
                        sessionId: sessionIds,
                        studentId: enrollment.userId,
                        status: ['present', 'late'],
                    },
                });
            }
            const pct = sessionIds.length ? Math.round((attended / sessionIds.length) * 100) : 0;
            const existing = certByUser.get(enrollment.userId);
            students.push({
                userId: enrollment.userId,
                name: enrollment.user?.fullName,
                enrollmentStatus: enrollment.status,
                totalSessions: sessionIds.length,
                attended,
                attendancePct: pct,
                eligible: pct >= (cohort.course?.minAttendancePct ?? 80),
                alreadyIssued: existing?.status === 'active',
                hasRevoked: existing?.status === 'revoked',
                certificateNumber: existing?.certificateNumber ?? null,
            });
        }
        return {
            cohort: {
                id: cohort.id,
                name: cohort.name,
                courseId: cohort.courseId,
                courseTitle: cohort.course?.title,
                minAttendancePct: cohort.course?.minAttendancePct ?? 80,
            },
            students,
        };
    }

    /** Public verification by code — never leaks more than needed. */
    async verify(code: string) {
        const certificate = await Certificate.findOne({
            where: { verificationCode: code.toUpperCase().trim() },
            include: [
                { model: User, attributes: ['fullName'] },
                { model: Course, attributes: ['title'] },
                { model: Cohort, attributes: ['id', 'name'] },
            ],
        });
        if (!certificate) return { valid: false };

        // Instructor of the cohort signs the certificate
        let teacherName: string | null = null;
        let teacherSignatureUrl: string | null = null;
        if (certificate.cohortId) {
            const assignment = await TeachingAssignment.findOne({
                where: { cohortId: certificate.cohortId, role: 'instructor' },
                include: [{ model: User, attributes: ['fullName', 'signatureUrl'] }],
            });
            teacherName = assignment?.teacher?.fullName ?? null;
            teacherSignatureUrl = assignment?.teacher?.signatureUrl ?? null;
        }

        return {
            valid:
                certificate.status === 'active' &&
                (!certificate.expiresAt || certificate.expiresAt > new Date()),
            status: certificate.status,
            certificateNumber: certificate.certificateNumber,
            verificationCode: certificate.verificationCode,
            holderName: certificate.holder?.fullName,
            title: certificate.title,
            description: certificate.description ?? null,
            courseTitle: certificate.course?.title ?? null,
            cohortName: certificate.cohort?.name ?? null,
            teacherName,
            teacherSignatureUrl,
            issuedAt: certificate.issuedAt,
            expiresAt: certificate.expiresAt,
        };
    }
}

export default new CertificateService();
