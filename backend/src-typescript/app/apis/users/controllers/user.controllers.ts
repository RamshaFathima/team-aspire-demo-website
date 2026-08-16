import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import userService from '../services/user.service';
import { audit } from '../../../utils/AuditUtil';

type IdParams = { id: string };

export class ListUsersController extends MasterController<null, any, null> {
    static doc() {
        return { tags: ['Users'], summary: 'List users', description: 'Paginated user directory' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                page: Joi.number().integer().min(1).optional(),
                limit: Joi.number().integer().min(1).max(100).optional(),
                search: Joi.string().max(120).optional(),
                status: Joi.string().valid('active', 'suspended').optional(),
                role: Joi.string().max(50).optional(),
            })
        );
        return payload;
    }

    async restController(_params: null, query: any): Promise<ResponseBuilder> {
        const result = await userService.list(query);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class GetUserController extends MasterController<IdParams, null, null> {
    static doc() {
        return { tags: ['Users'], summary: 'Get user', description: 'User detail with roles' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        return payload;
    }

    async restController(params: IdParams): Promise<ResponseBuilder> {
        const user = await userService.get(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, user, 'OK');
    }
}

export class CreateUserController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['Users'], summary: 'Create user', description: 'Admin-created account' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                fullName: Joi.string().min(2).max(120).required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(8).max(100).required(),
                phone: Joi.string().max(20).optional(),
                roleKeys: Joi.array().items(Joi.string()).default([]),
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
        const user = await userService.create(body);
        audit(allData, {
            action: 'user.create',
            resourceType: 'user',
            resourceId: user.id,
            metadata: { roles: body.roleKeys },
        });
        return new ResponseBuilder(StatusCodes.CREATED, user, 'User created');
    }
}

export class UpdateUserController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['Users'], summary: 'Update user', description: 'Update profile/status/password' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(
            Joi.object().keys({
                fullName: Joi.string().min(2).max(120).optional(),
                phone: Joi.string().max(20).allow(null).optional(),
                status: Joi.string().valid('active', 'suspended').optional(),
                password: Joi.string().min(8).max(100).optional(),
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
        const user = await userService.update(params.id, body);
        audit(allData, {
            action: 'user.update',
            resourceType: 'user',
            resourceId: params.id,
            metadata: { fields: Object.keys(body) },
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, user, 'User updated');
    }
}

export class SetUserRolesController extends MasterController<IdParams, null, { roleKeys: string[] }> {
    static doc() {
        return { tags: ['Users'], summary: 'Assign roles', description: 'Replace a user’s role set' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(
            Joi.object().keys({ roleKeys: Joi.array().items(Joi.string()).required() })
        );
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: { roleKeys: string[] },
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await userService.setRoles(params.id, body.roleKeys);
        audit(allData, {
            action: 'user.role_change',
            resourceType: 'user',
            resourceId: params.id,
            metadata: { roles: body.roleKeys },
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Roles updated');
    }
}
