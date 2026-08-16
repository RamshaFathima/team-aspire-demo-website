import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import publicService from '../services/public.service';
import platformService from '../../platform/services/platform.service';
import certificateService from '../../certificates/services/certificate.service';

const slugPath = () => {
    const payload = new RequestBuilder();
    payload.addToPath(Joi.object().keys({ slug: Joi.string().max(200).required() }));
    return payload;
};

const idPath = () => {
    const payload = new RequestBuilder();
    payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
    return payload;
};

export class PublicSettingsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Public settings', description: 'site.*, features.*, donations.*' };
    }

    async restController(): Promise<ResponseBuilder> {
        const settings = await platformService.publicSettings();
        return new ResponseBuilder(StatusCodes.SUCCESS, settings, 'OK');
    }
}

export class PublicProjectsController extends MasterController<null, { category?: string }, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Projects', description: 'Active & completed projects' };
    }

    async restController(_params: null, query: { category?: string }): Promise<ResponseBuilder> {
        const projects = await publicService.listProjects(query.category);
        return new ResponseBuilder(StatusCodes.SUCCESS, projects, 'OK');
    }
}

export class PublicProjectDetailController extends MasterController<{ slug: string }, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Project detail', description: 'Project by slug with updates' };
    }

    public static validate(): RequestBuilder {
        return slugPath();
    }

    async restController(params: { slug: string }): Promise<ResponseBuilder> {
        const project = await publicService.getProject(params.slug);
        return new ResponseBuilder(StatusCodes.SUCCESS, project, 'OK');
    }
}

export class PublicCampaignsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Campaigns', description: 'Active fundraising campaigns' };
    }

    async restController(): Promise<ResponseBuilder> {
        const campaigns = await publicService.listCampaigns();
        return new ResponseBuilder(StatusCodes.SUCCESS, campaigns, 'OK');
    }
}

export class PublicCoursesController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Courses', description: 'Published courses' };
    }

    async restController(): Promise<ResponseBuilder> {
        const courses = await publicService.listCourses();
        return new ResponseBuilder(StatusCodes.SUCCESS, courses, 'OK');
    }
}

export class PublicCourseDetailController extends MasterController<{ slug: string }, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Course detail', description: 'Published course + open batches' };
    }

    public static validate(): RequestBuilder {
        return slugPath();
    }

    async restController(params: { slug: string }): Promise<ResponseBuilder> {
        const course = await publicService.getCourse(params.slug);
        return new ResponseBuilder(StatusCodes.SUCCESS, course, 'OK');
    }
}

export class PublicPageController extends MasterController<{ slug: string }, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'CMS page', description: 'Published page by slug' };
    }

    public static validate(): RequestBuilder {
        return slugPath();
    }

    async restController(params: { slug: string }): Promise<ResponseBuilder> {
        const page = await publicService.getPage(params.slug);
        return new ResponseBuilder(StatusCodes.SUCCESS, page, 'OK');
    }
}

export class PublicStatsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Impact stats', description: 'Homepage impact numbers' };
    }

    async restController(): Promise<ResponseBuilder> {
        const stats = await publicService.stats();
        return new ResponseBuilder(StatusCodes.SUCCESS, stats, 'OK');
    }
}

export class InitiateDonationController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['Public'], summary: 'Donate', description: 'Start a donation (mock gateway)' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                donorName: Joi.string().min(2).max(120).required(),
                donorEmail: Joi.string().email().required(),
                donorPhone: Joi.string().max(20).allow('', null).optional(),
                amount: Joi.number().min(1).max(10_000_000).required(),
                projectId: Joi.string().uuid().allow(null).optional(),
                campaignId: Joi.string().uuid().allow(null).optional(),
                frequency: Joi.string().valid('one_time', 'monthly').default('one_time'),
                method: Joi.string().valid('mock_upi', 'mock_card', 'bank_transfer').default('mock_upi'),
                isAnonymous: Joi.boolean().default(false),
                message: Joi.string().max(500).allow('', null).optional(),
            })
        );
        return payload;
    }

    async restController(_params: null, _query: null, body: any): Promise<ResponseBuilder> {
        const result = await publicService.initiateDonation(body);
        return new ResponseBuilder(StatusCodes.CREATED, result, 'Donation initiated');
    }
}

export class ConfirmPublicDonationController extends MasterController<{ id: string }, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Payment webhook (success)', description: 'Mock PSP success callback — idempotent' };
    }

    public static validate(): RequestBuilder {
        return idPath();
    }

    async restController(params: { id: string }): Promise<ResponseBuilder> {
        const result = await publicService.confirmDonation(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Donation successful');
    }
}

export class FailPublicDonationController extends MasterController<{ id: string }, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Payment webhook (failure)', description: 'Mock PSP failure callback' };
    }

    public static validate(): RequestBuilder {
        return idPath();
    }

    async restController(params: { id: string }): Promise<ResponseBuilder> {
        const result = await publicService.failDonation(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Donation marked failed');
    }
}

export class PublicDonationStatusController extends MasterController<{ id: string }, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Donation status', description: 'Public receipt view' };
    }

    public static validate(): RequestBuilder {
        return idPath();
    }

    async restController(params: { id: string }): Promise<ResponseBuilder> {
        const status = await publicService.donationStatus(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, status, 'OK');
    }
}

export class VerifyCertificateController extends MasterController<{ code: string }, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Verify certificate', description: 'Public certificate verification' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ code: Joi.string().max(20).required() }));
        return payload;
    }

    async restController(params: { code: string }): Promise<ResponseBuilder> {
        const result = await certificateService.verify(params.code);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class SubmitFormController extends MasterController<{ kind: string }, null, any> {
    static doc() {
        return { tags: ['Public'], summary: 'Submit form', description: 'Contact / volunteer form → CRM' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ kind: Joi.string().valid('contact', 'volunteer').required() }));
        payload.addToBody(
            Joi.object().keys({
                fullName: Joi.string().min(2).max(120).required(),
                email: Joi.string().email().required(),
                phone: Joi.string().max(20).allow('', null).optional(),
                message: Joi.string().min(5).max(2000).required(),
            })
        );
        return payload;
    }

    async restController(params: { kind: string }, _query: null, body: any): Promise<ResponseBuilder> {
        const result = await publicService.submitForm(params.kind, body);
        return new ResponseBuilder(StatusCodes.CREATED, result, 'Thank you — we will get back to you soon');
    }
}

export class PublicUpcomingSessionsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Public'], summary: 'Upcoming classes', description: 'Next scheduled public sessions' };
    }

    async restController(): Promise<ResponseBuilder> {
        const sessions = await publicService.upcomingSessions();
        return new ResponseBuilder(StatusCodes.SUCCESS, sessions, 'OK');
    }
}
