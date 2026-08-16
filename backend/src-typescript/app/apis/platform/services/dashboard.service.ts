import { Op } from 'sequelize';
import { QueryTypes } from 'sequelize';
import Donation from '../../../models/donation.model';
import Project from '../../../models/project.model';
import Course from '../../../models/course.model';
import Cohort from '../../../models/cohort.model';
import ClassSession from '../../../models/class.session.model';
import Enrollment from '../../../models/enrollment.model';
import Certificate from '../../../models/certificate.model';
import Attendance from '../../../models/attendance.model';
import User from '../../../models/user.model';
import { sequelize } from '../../../../config/sequelizeConfig';

class DashboardService {
    async overview() {
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const [
            donationsAllTime,
            donationsAllTimeCount,
            donationsThisMonth,
            donationsThisMonthCount,
            donorRows,
            activeProjects,
            activeStudents,
            publishedCourses,
            certificatesIssued,
            totalUsers,
            attendanceTotal,
            attendancePresent,
            trend,
            recentDonations,
            upcomingSessions,
        ] = await Promise.all([
            Donation.sum('amount', { where: { status: 'success' } }),
            Donation.count({ where: { status: 'success' } }),
            Donation.sum('amount', {
                where: { status: 'success', createdAt: { [Op.gte]: monthStart } },
            }),
            Donation.count({ where: { status: 'success', createdAt: { [Op.gte]: monthStart } } }),
            Donation.count({ where: { status: 'success' }, distinct: true, col: 'donor_email' }),
            Project.count({ where: { status: 'active' } }),
            Enrollment.count({ where: { status: ['active', 'completed'] }, distinct: true, col: 'user_id' }),
            Course.count({ where: { status: 'published' } }),
            Certificate.count({ where: { status: 'active' } }),
            User.count(),
            Attendance.count(),
            Attendance.count({ where: { status: ['present', 'late'] } }),
            sequelize.query(
                `SELECT to_char(date_trunc('month', created_at), 'Mon YYYY') AS month,
                        date_trunc('month', created_at)                        AS month_start,
                        coalesce(sum(amount), 0)                               AS total,
                        count(*)                                               AS count
                 FROM donations
                 WHERE status = 'success' AND created_at >= :since
                 GROUP BY date_trunc('month', created_at)
                 ORDER BY date_trunc('month', created_at)`,
                { replacements: { since: sixMonthsAgo }, type: QueryTypes.SELECT }
            ),
            Donation.findAll({ order: [['createdAt', 'DESC']], limit: 8 }),
            ClassSession.findAll({
                where: { startsAt: { [Op.gte]: new Date() }, status: 'scheduled' },
                include: [{ model: Cohort, include: [{ model: Course, attributes: ['title'] }] }],
                order: [['startsAt', 'ASC']],
                limit: 6,
            }),
        ]);

        return {
            totals: {
                donationsAllTime: donationsAllTime ?? 0,
                donationsAllTimeCount,
                donationsThisMonth: donationsThisMonth ?? 0,
                donationsThisMonthCount,
                donors: donorRows,
                activeProjects,
                activeStudents,
                publishedCourses,
                certificatesIssued,
                totalUsers,
                attendanceRate: attendanceTotal
                    ? Math.round((attendancePresent / attendanceTotal) * 100)
                    : null,
            },
            donationTrend: trend,
            recentDonations,
            upcomingSessions: upcomingSessions.map((s) => ({
                ...s.get({ plain: true }),
                cohortName: s.cohort?.name,
                courseTitle: s.cohort?.course?.title,
                cohort: undefined,
            })),
        };
    }
}

export default new DashboardService();
