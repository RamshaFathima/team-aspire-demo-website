import { Op } from 'sequelize';
import Project from '../../../models/project.model';
import ProjectUpdate from '../../../models/project.update.model';
import Campaign from '../../../models/campaign.model';
import Course from '../../../models/course.model';
import Cohort from '../../../models/cohort.model';
import ClassSession from '../../../models/class.session.model';
import Enrollment from '../../../models/enrollment.model';
import Donation from '../../../models/donation.model';
import Certificate from '../../../models/certificate.model';
import Page from '../../../models/page.model';
import User from '../../../models/user.model';
import FormSubmission from '../../../models/form.submission.model';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';
import { makeGatewayRef } from '../../../utils/Ids';
import { ensureContact, logInteraction } from '../../../utils/CrmUtil';
import donationService from '../../donations/services/donation.service';
import platformService from '../../platform/services/platform.service';

class PublicService {
    async listProjects(category?: string) {
        const where: any = { status: ['active', 'completed'] };
        if (category) where.category = category;
        return Project.findAll({
            where,
            order: [
                ['featured', 'DESC'],
                ['publishedAt', 'DESC'],
            ],
        });
    }

    async getProject(slug: string) {
        const project = await Project.findOne({
            where: { slug, status: ['active', 'completed'] },
            include: [{ model: ProjectUpdate }],
            order: [[{ model: ProjectUpdate, as: 'updates' }, 'createdAt', 'DESC']],
        });
        if (!project) throw new ValidationError('Project not found', StatusCodes.NOT_FOUND);
        return project;
    }

    async listCampaigns() {
        return Campaign.findAll({ where: { status: 'active' }, order: [['createdAt', 'DESC']] });
    }

    async listCourses() {
        return Course.findAll({ where: { status: 'published' }, order: [['publishedAt', 'DESC']] });
    }

    async getCourse(slug: string) {
        const course = await Course.findOne({ where: { slug, status: 'published' } });
        if (!course) throw new ValidationError('Course not found', StatusCodes.NOT_FOUND);
        const openCohorts = await Cohort.findAll({
            where: { courseId: course.id, status: ['upcoming', 'active'] },
            order: [['startsOn', 'ASC']],
        });
        return { ...course.get({ plain: true }), cohorts: openCohorts };
    }

    async getPage(slug: string) {
        const page = await Page.findOne({ where: { slug, status: 'published' } });
        if (!page) throw new ValidationError('Page not found', StatusCodes.NOT_FOUND);
        return page;
    }

    async stats() {
        const [totalRaised, projects, studentsServed, certificatesIssued] = await Promise.all([
            Donation.sum('amount', { where: { status: 'success' } }),
            Project.count({ where: { status: ['active', 'completed'] } }),
            Enrollment.count({ distinct: true, col: 'user_id' }),
            Certificate.count({ where: { status: 'active' } }),
        ]);
        return {
            totalRaised: totalRaised ?? 0,
            projects,
            studentsServed,
            certificatesIssued,
        };
    }

    async initiateDonation(data: {
        donorName: string;
        donorEmail: string;
        donorPhone?: string;
        amount: number;
        projectId?: string | null;
        campaignId?: string | null;
        frequency: string;
        method: string;
        isAnonymous: boolean;
        message?: string;
    }) {
        const settings = await platformService.publicSettings();
        const minAmount = Number(settings['donations.minAmount'] ?? 10);
        if (data.amount < minAmount) {
            throw new ValidationError(`Minimum donation amount is ₹${minAmount}`);
        }

        if (data.projectId && !(await Project.findByPk(data.projectId))) {
            throw new ValidationError('Project not found', StatusCodes.NOT_FOUND);
        }
        if (data.campaignId && !(await Campaign.findByPk(data.campaignId))) {
            throw new ValidationError('Campaign not found', StatusCodes.NOT_FOUND);
        }

        // Link to a member account when the email matches a registered user
        const user = await User.findOne({ where: { email: data.donorEmail.toLowerCase() } });

        const donation = await Donation.create({
            donorName: data.donorName,
            donorEmail: data.donorEmail.toLowerCase(),
            donorPhone: data.donorPhone ?? null,
            userId: user?.id ?? null,
            projectId: data.projectId ?? null,
            campaignId: data.campaignId ?? null,
            amount: data.amount,
            frequency: data.frequency,
            method: data.method,
            isAnonymous: data.isAnonymous,
            message: data.message ?? null,
            gatewayRef: makeGatewayRef(),
            status: data.method === 'bank_transfer' ? 'pending' : 'initiated',
        } as any);

        return {
            donationId: donation.id,
            gatewayRef: donation.gatewayRef,
            amount: donation.amount,
            status: donation.status,
            // A real PSP integration would return the gateway checkout URL here
            checkout:
                data.method === 'bank_transfer'
                    ? null
                    : { simulator: true, confirmPath: `/api/v1/public/donations/${donation.id}/confirm` },
        };
    }

    /** Mock payment-gateway webhook — idempotent, safe to replay. */
    async confirmDonation(donationId: string) {
        const result = await donationService.confirm(donationId);
        return { ok: true, status: 'success', receiptNumber: result.receiptNumber };
    }

    async failDonation(donationId: string) {
        return donationService.markFailed(donationId);
    }

    async donationStatus(id: string) {
        const donation = await Donation.findByPk(id, {
            include: [{ model: Project, attributes: ['title'] }],
        });
        if (!donation) throw new ValidationError('Donation not found', StatusCodes.NOT_FOUND);
        return {
            id: donation.id,
            donorName: donation.isAnonymous ? 'Anonymous' : donation.donorName,
            amount: donation.amount,
            currency: donation.currency,
            status: donation.status,
            method: donation.method,
            receiptNumber: donation.receiptNumber,
            projectTitle: donation.project?.title ?? null,
            createdAt: donation.createdAt,
        };
    }

    async submitForm(kind: string, data: { fullName: string; email: string; phone?: string; message: string }) {
        const submission = await FormSubmission.create({ kind, payload: data } as any);

        const contactId = await ensureContact({
            fullName: data.fullName,
            email: data.email.toLowerCase(),
            phone: data.phone,
            type: kind === 'volunteer' ? 'volunteer' : 'other',
        });
        await logInteraction({
            contactId,
            kind: 'form',
            subject: kind === 'volunteer' ? 'Volunteer application submitted' : 'Contact form submitted',
            detail: data.message,
        });
        return { ok: true, id: submission.id };
    }

    async upcomingSessions() {
        const sessions = await ClassSession.findAll({
            where: { startsAt: { [Op.gte]: new Date() }, status: 'scheduled' },
            include: [
                {
                    model: Cohort,
                    include: [{ model: Course, attributes: ['title', 'slug', 'status'] }],
                },
            ],
            order: [['startsAt', 'ASC']],
            limit: 10,
        });
        return sessions
            .filter((s) => s.cohort?.course?.status === 'published')
            .map((s) => ({
                id: s.id,
                title: s.title,
                topic: s.topic,
                startsAt: s.startsAt,
                cohortName: s.cohort?.name,
                courseTitle: s.cohort?.course?.title,
                courseSlug: s.cohort?.course?.slug,
            }));
    }
}

export default new PublicService();
