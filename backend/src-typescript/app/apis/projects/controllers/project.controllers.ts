import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import projectService from '../services/project.service';
import { audit } from '../../../utils/AuditUtil';

type IdParams = { id: string };

const projectBodySchema = {
    title: Joi.string().min(3).max(160),
    slug: Joi.string().min(2).max(160),
    summary: Joi.string().max(600).allow(null, ''),
    description: Joi.string().allow(null, ''),
    category: Joi.string().max(60).allow(null, ''),
    location: Joi.string().max(160).allow(null, ''),
    goalAmount: Joi.number().positive().allow(null),
    impactStats: Joi.array().items(Joi.object({ label: Joi.string(), value: Joi.string() })),
    coverImage: Joi.string().uri().allow(null, ''),
    featured: Joi.boolean(),
    startedAt: Joi.date().allow(null),
};

export class ListProjectsController extends MasterController<null, any, null> {
    static doc() {
        return { tags: ['Projects'], summary: 'List projects (admin)', description: 'Paginated projects' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                page: Joi.number().integer().min(1).optional(),
                limit: Joi.number().integer().min(1).max(100).optional(),
                search: Joi.string().max(120).optional(),
                status: Joi.string().valid('draft', 'active', 'completed', 'archived').optional(),
            })
        );
        return payload;
    }

    async restController(_params: null, query: any): Promise<ResponseBuilder> {
        const result = await projectService.list(query);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class GetProjectController extends MasterController<IdParams, null, null> {
    static doc() {
        return { tags: ['Projects'], summary: 'Get project (admin)', description: 'Project with updates' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        return payload;
    }

    async restController(params: IdParams): Promise<ResponseBuilder> {
        const project = await projectService.get(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, project, 'OK');
    }
}

export class CreateProjectController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['Projects'], summary: 'Create project', description: 'Create a project (draft)' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({ ...projectBodySchema, title: projectBodySchema.title.required() })
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
        const project = await projectService.create(body);
        audit(allData, { action: 'project.create', resourceType: 'project', resourceId: project.id });
        return new ResponseBuilder(StatusCodes.CREATED, project, 'Project created');
    }
}

export class UpdateProjectController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['Projects'], summary: 'Update project', description: 'Edit project fields' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(Joi.object().keys(projectBodySchema));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const project = await projectService.update(params.id, body);
        audit(allData, { action: 'project.update', resourceType: 'project', resourceId: params.id });
        return new ResponseBuilder(StatusCodes.SUCCESS, project, 'Project updated');
    }
}

export class SetProjectStatusController extends MasterController<IdParams, null, { status: string }> {
    static doc() {
        return { tags: ['Projects'], summary: 'Set project status', description: 'Publish/complete/archive' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(
            Joi.object().keys({
                status: Joi.string().valid('draft', 'active', 'completed', 'archived').required(),
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
        const project = await projectService.setStatus(params.id, body.status);
        audit(allData, {
            action: 'project.status_change',
            resourceType: 'project',
            resourceId: params.id,
            metadata: { status: body.status },
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, project, 'Status updated');
    }
}

export class AddProjectUpdateController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['Projects'], summary: 'Post project update', description: 'Progress update entry' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(
            Joi.object().keys({
                title: Joi.string().min(3).max(200).required(),
                body: Joi.string().allow('', null).optional(),
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
        const update = await projectService.addUpdate(params.id, body, allData.userCtx.id);
        audit(allData, { action: 'project.update_posted', resourceType: 'project', resourceId: params.id });
        return new ResponseBuilder(StatusCodes.CREATED, update, 'Update posted');
    }
}

export class DeleteProjectUpdateController extends MasterController<
    { id: string; updateId: string },
    null,
    null
> {
    static doc() {
        return { tags: ['Projects'], summary: 'Delete project update', description: 'Remove an update' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(
            Joi.object().keys({
                id: Joi.string().uuid().required(),
                updateId: Joi.string().uuid().required(),
            })
        );
        return payload;
    }

    async restController(
        params: { id: string; updateId: string },
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await projectService.deleteUpdate(params.updateId);
        audit(allData, {
            action: 'project.update_deleted',
            resourceType: 'project_update',
            resourceId: params.updateId,
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Update deleted');
    }
}
