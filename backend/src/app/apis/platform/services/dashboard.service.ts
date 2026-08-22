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
import AuditLog from '../../../models/audit.log.model';
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

    /** Rich series for the analytics dashboard (charts). */
    async analytics() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const twelveWeeksAgo = new Date();
        twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 7 * 11);
        twelveWeeksAgo.setHours(0, 0, 0, 0);

        const [donationsByDay, donationsByProject, donationsByStatus, enrollmentsByCourse, attendanceBySession, memberGrowth, recentActivity] =
            await Promise.all([
                sequelize.query(
                    `SELECT to_char(d, 'DD Mon')                       AS day,
                            d                                          AS date,
                            coalesce(sum(dn.amount), 0)::float         AS total,
                            count(dn.id)::int                          AS count
                     FROM generate_series(:since::date, now()::date, interval '1 day') AS d
                     LEFT JOIN donations dn
                        ON date_trunc('day', dn.created_at) = d AND dn.status = 'success'
                     GROUP BY d ORDER BY d`,
                    { replacements: { since: thirtyDaysAgo }, type: QueryTypes.SELECT }
                ),
                sequelize.query(
                    `SELECT coalesce(p.title, 'General fund') AS name,
                            sum(d.amount)::float              AS value
                     FROM donations d
                     LEFT JOIN projects p ON p.id = d.project_id
                     WHERE d.status = 'success'
                     GROUP BY p.title ORDER BY value DESC LIMIT 8`,
                    { type: QueryTypes.SELECT }
                ),
                sequelize.query(
                    `SELECT status AS name, count(*)::int AS value
                     FROM donations GROUP BY status ORDER BY value DESC`,
                    { type: QueryTypes.SELECT }
                ),
                sequelize.query(
                    `SELECT c.title AS name, count(e.id)::int AS value
                     FROM enrollments e JOIN courses c ON c.id = e.course_id
                     GROUP BY c.title ORDER BY value DESC LIMIT 8`,
                    { type: QueryTypes.SELECT }
                ),
                sequelize.query(
                    `SELECT cs.title                                            AS name,
                            cs.starts_at                                        AS date,
                            count(*) FILTER (WHERE a.status IN ('present','late'))::int AS present,
                            count(*) FILTER (WHERE a.status = 'absent')::int    AS absent
                     FROM class_sessions cs
                     JOIN attendance a ON a.session_id = cs.id
                     WHERE cs.status = 'completed'
                     GROUP BY cs.id, cs.title, cs.starts_at
                     ORDER BY cs.starts_at DESC LIMIT 10`,
                    { type: QueryTypes.SELECT }
                ),
                sequelize.query(
                    `SELECT to_char(date_trunc('week', d), 'DD Mon') AS week,
                            count(u.id)::int                          AS value
                     FROM generate_series(:since::date, now()::date, interval '1 week') AS d
                     LEFT JOIN users u ON date_trunc('week', u.created_at) = date_trunc('week', d)
                     GROUP BY date_trunc('week', d) ORDER BY date_trunc('week', d)`,
                    { replacements: { since: twelveWeeksAgo }, type: QueryTypes.SELECT }
                ),
                AuditLog.findAll({ order: [['createdAt', 'DESC']], limit: 12 }),
            ]);

        return {
            donationsByDay,
            donationsByProject,
            donationsByStatus,
            enrollmentsByCourse,
            attendanceBySession: (attendanceBySession as any[]).reverse(),
            memberGrowth,
            recentActivity,
        };
    }
}

export default new DashboardService();
