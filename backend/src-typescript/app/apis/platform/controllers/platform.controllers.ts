import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import dashboardService from '../services/dashboard.service';
import platformService from '../services/platform.service';
import { audit } from '../../../utils/AuditUtil';

export class DashboardController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Platform'], summary: 'Dashboard', description: 'Operational overview & KPIs' };
    }

    async restController(): Promise<ResponseBuilder> {
        const overview = await dashboardService.overview();
        return new ResponseBuilder(StatusCodes.SUCCESS, overview, 'OK');
    }
}

export class ListAuditLogsController extends MasterController<null, any, null> {
    static doc() {
        return { tags: ['Platform'], summary: 'Audit logs', description: 'Filterable audit trail' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                page: Joi.number().integer().min(1).optional(),
                limit: Joi.number().integer().min(1).max(200).optional(),
                action: Joi.string().max(120).optional(),
                resourceType: Joi.string().max(60).optional(),
                actorEmail: Joi.string().max(120).optional(),
            })
        );
        return payload;
    }

    async restController(_params: null, query: any): Promise<ResponseBuilder> {
        const result = await platformService.listAuditLogs(query);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class ListSettingsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Platform'], summary: 'List settings', description: 'All platform settings' };
    }

    async restController(): Promise<ResponseBuilder> {
        const settings = await platformService.listSettings();
        return new ResponseBuilder(StatusCodes.SUCCESS, settings, 'OK');
    }
}

export class UpsertSettingController extends MasterController<{ key: string }, null, any> {
    static doc() {
        return { tags: ['Platform'], summary: 'Upsert setting', description: 'Create or update a setting' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ key: Joi.string().max(120).required() }));
        payload.addToBody(
            Joi.object().keys({
                value: Joi.any().required(),
                description: Joi.string().max(300).optional(),
            })
        );
        return payload;
    }

    async restController(
        params: { key: string },
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const setting = await platformService.upsertSetting(
            params.key,
            body.value,
            body.description,
            allData.userCtx.id
        );
        audit(allData, { action: 'setting.update', resourceType: 'setting', resourceId: params.key });
        return new ResponseBuilder(StatusCodes.SUCCESS, setting, 'Setting saved');
    }
}

export class DeleteSettingController extends MasterController<{ key: string }, null, null> {
    static doc() {
        return { tags: ['Platform'], summary: 'Delete setting', description: 'Remove a setting key' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ key: Joi.string().max(120).required() }));
        return payload;
    }

    async restController(
        params: { key: string },
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await platformService.deleteSetting(params.key);
        audit(allData, { action: 'setting.delete', resourceType: 'setting', resourceId: params.key });
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Setting deleted');
    }
}
