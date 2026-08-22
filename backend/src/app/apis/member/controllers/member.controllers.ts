import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import memberService from '../services/member.service';

export class MyDonationsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Member'], summary: 'My donations', description: 'Donation history of the member' };
    }

    async restController(
        _params: null,
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const donations = await memberService.myDonations(allData.userCtx.email);
        return new ResponseBuilder(StatusCodes.SUCCESS, donations, 'OK');
    }
}

export class MyEnrollmentsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Member'], summary: 'My enrollments', description: 'Courses the member is enrolled in' };
    }

    async restController(
        _params: null,
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const enrollments = await memberService.myEnrollments(allData.userCtx.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, enrollments, 'OK');
    }
}

export class MyUpcomingSessionsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Member'], summary: 'My upcoming classes', description: 'Next classes for the member' };
    }

    async restController(
        _params: null,
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const sessions = await memberService.myUpcomingSessions(allData.userCtx.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, sessions, 'OK');
    }
}

export class MyCertificatesController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Member'], summary: 'My certificates', description: 'Certificates issued to the member' };
    }

    async restController(
        _params: null,
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const certificates = await memberService.myCertificates(allData.userCtx.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, certificates, 'OK');
    }
}

export class MyNotificationsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Member'], summary: 'My notifications', description: 'In-app notifications' };
    }

    async restController(
        _params: null,
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const notifications = await memberService.myNotifications(allData.userCtx.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, notifications, 'OK');
    }
}

export class MarkNotificationsReadController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Member'], summary: 'Mark notifications read', description: 'Mark all as read' };
    }

    async restController(
        _params: null,
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await memberService.markNotificationsRead(allData.userCtx.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Notifications marked read');
    }
}

export class SelfEnrollController extends MasterController<null, null, { cohortId: string }> {
    static doc() {
        return { tags: ['Member'], summary: 'Enroll', description: 'Self-enroll into an open batch' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(Joi.object().keys({ cohortId: Joi.string().uuid().required() }));
        return payload;
    }

    async restController(
        _params: null,
        _query: null,
        body: { cohortId: string },
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const enrollment = await memberService.selfEnroll(allData.userCtx, body.cohortId);
        return new ResponseBuilder(StatusCodes.CREATED, enrollment, 'Enrolled successfully');
    }
}
