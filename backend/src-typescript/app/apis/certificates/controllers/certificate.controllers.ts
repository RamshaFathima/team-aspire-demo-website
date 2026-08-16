import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import certificateService from '../services/certificate.service';
import { audit } from '../../../utils/AuditUtil';

type IdParams = { id: string };

export class ListCertificatesController extends MasterController<null, any, null> {
    static doc() {
        return { tags: ['Certificates'], summary: 'List certificates', description: 'Paginated certificates' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                page: Joi.number().integer().min(1).optional(),
                limit: Joi.number().integer().min(1).max(100).optional(),
                search: Joi.string().max(120).optional(),
                status: Joi.string().valid('active', 'revoked').optional(),
            })
        );
        return payload;
    }

    async restController(_params: null, query: any): Promise<ResponseBuilder> {
        const result = await certificateService.list(query);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class IssueCertificateController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['Certificates'], summary: 'Issue certificate', description: 'Issue to a user, optional course/cohort link' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                userId: Joi.string().uuid().required(),
                courseId: Joi.string().uuid().allow(null).optional(),
                cohortId: Joi.string().uuid().allow(null).optional(),
                title: Joi.string().min(3).max(200).required(),
                description: Joi.string().max(500).allow(null, '').optional(),
                expiresAt: Joi.date().allow(null).optional(),
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
        const certificate = await certificateService.issue(body, allData.userCtx.id);
        audit(allData, {
            action: 'certificate.issue',
            resourceType: 'certificate',
            resourceId: certificate.id,
            metadata: { userId: body.userId },
        });
        return new ResponseBuilder(StatusCodes.CREATED, certificate, 'Certificate issued');
    }
}

export class RevokeCertificateController extends MasterController<IdParams, null, { reason: string }> {
    static doc() {
        return { tags: ['Certificates'], summary: 'Revoke certificate', description: 'Revoke with reason' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(Joi.object().keys({ reason: Joi.string().min(3).max(300).required() }));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: { reason: string },
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const certificate = await certificateService.revoke(params.id, body.reason);
        audit(allData, {
            action: 'certificate.revoke',
            resourceType: 'certificate',
            resourceId: params.id,
            metadata: { reason: body.reason },
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, certificate, 'Certificate revoked');
    }
}

export class CertificateEligibilityController extends MasterController<{ cohortId: string }, null, null> {
    static doc() {
        return { tags: ['Certificates'], summary: 'Eligibility', description: 'Attendance-based eligibility for a cohort' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ cohortId: Joi.string().uuid().required() }));
        return payload;
    }

    async restController(params: { cohortId: string }): Promise<ResponseBuilder> {
        const result = await certificateService.eligibility(params.cohortId);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}
