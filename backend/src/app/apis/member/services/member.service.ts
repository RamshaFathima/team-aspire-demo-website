import { Op } from 'sequelize';
import Donation from '../../../models/donation.model';
import Project from '../../../models/project.model';
import Enrollment from '../../../models/enrollment.model';
import Certificate from '../../../models/certificate.model';
import Notification from '../../../models/notification.model';
import ClassSession from '../../../models/class.session.model';
import Cohort from '../../../models/cohort.model';
import Course from '../../../models/course.model';
import lmsService from '../../lms/services/lms.service';
import { IUserContext } from '../../../middlewares/permission.middleware';

class MemberService {
    async myDonations(email: string) {
        return Donation.findAll({
            where: { donorEmail: email },
            include: [{ model: Project, attributes: ['title', 'slug'] }],
            order: [['createdAt', 'DESC']],
        });
    }

    async myEnrollments(userId: string) {
        const rows = await Enrollment.findAll({
            where: { userId },
            include: [
                { model: Course, attributes: ['title', 'slug'] },
                { model: Cohort, attributes: ['name', 'scheduleNote'] },
            ],
            order: [['enrolledAt', 'DESC']],
        });
        return rows.map((e) => ({
            ...e.get({ plain: true }),
            courseTitle: e.course?.title,
            courseSlug: e.course?.slug,
            cohortName: e.cohort?.name,
            scheduleNote: e.cohort?.scheduleNote,
            course: undefined,
            cohort: undefined,
        }));
    }

    async myUpcomingSessions(userId: string) {
        const enrollments = await Enrollment.findAll({ where: { userId, status: 'active' } });
        const cohortIds = enrollments.map((e) => e.cohortId);
        if (!cohortIds.length) return [];

        const sessions = await ClassSession.findAll({
            where: {
                cohortId: cohortIds,
                status: 'scheduled',
                startsAt: { [Op.gte]: new Date() },
            },
            include: [{ model: Cohort, include: [{ model: Course, attributes: ['title'] }] }],
            order: [['startsAt', 'ASC']],
            limit: 10,
        });
        return sessions.map((s) => ({
            ...s.get({ plain: true }),
            cohortName: s.cohort?.name,
            courseTitle: s.cohort?.course?.title,
            cohort: undefined,
        }));
    }

    async myCertificates(userId: string) {
        return Certificate.findAll({ where: { userId }, order: [['issuedAt', 'DESC']] });
    }

    async myNotifications(userId: string) {
        return Notification.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']],
            limit: 50,
        });
    }

    async markNotificationsRead(userId: string) {
        await Notification.update(
            { readAt: new Date() },
            { where: { userId, readAt: null as unknown as undefined } }
        );
        return { ok: true };
    }

    async selfEnroll(userCtx: IUserContext, cohortId: string) {
        return lmsService.enroll(cohortId, userCtx.id, null, true);
    }
}

export default new MemberService();
