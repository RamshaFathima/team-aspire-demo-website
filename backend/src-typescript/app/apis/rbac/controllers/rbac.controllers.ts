import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import rbacService from '../services/rbac.service';
import { audit } from '../../../utils/AuditUtil';

export class ListPermissionsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['RBAC'], summary: 'List permissions', description: 'Permission catalogue' };
    }

    async restController(): Promise<ResponseBuilder> {
        const permissions = await rbacService.listPermissions();
        return new ResponseBuilder(StatusCodes.SUCCESS, permissions, 'OK');
    }
}

export class ListRolesController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['RBAC'], summary: 'List roles', description: 'Roles with their grants' };
    }

    async restController(): Promise<ResponseBuilder> {
        const roles = await rbacService.listRoles();
        return new ResponseBuilder(StatusCodes.SUCCESS, roles, 'OK');
    }
}

export class CreateRoleController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['RBAC'], summary: 'Create role', description: 'Create a custom role' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                key: Joi.string()
                    .pattern(/^[A-Z0-9_]+$/)
                    .min(2)
                    .max(50)
                    .required(),
                name: Joi.string().min(2).max(80).required(),
                description: Joi.string().max(300).optional(),
                permissionKeys: Joi.array().items(Joi.string()).default([]),
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
        const role = await rbacService.createRole(body);
        audit(allData, {
            action: 'role.create',
            resourceType: 'role',
            resourceId: role.id,
            metadata: { key: role.key },
        });
        return new ResponseBuilder(StatusCodes.CREATED, role, 'Role created');
    }
}

export class SetRolePermissionsController extends MasterController<
    { id: string },
    null,
    { permissionKeys: string[] }
> {
    static doc() {
        return { tags: ['RBAC'], summary: 'Set role permissions', description: 'Replace grants for a role' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(
            Joi.object().keys({ permissionKeys: Joi.array().items(Joi.string()).required() })
        );
        return payload;
    }

    async restController(
        params: { id: string },
        _query: null,
        body: { permissionKeys: string[] },
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await rbacService.setRolePermissions(params.id, body.permissionKeys);
        audit(allData, {
            action: 'role.permissions_change',
            resourceType: 'role',
            resourceId: params.id,
            metadata: { permissions: body.permissionKeys },
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Permissions updated');
    }
}
