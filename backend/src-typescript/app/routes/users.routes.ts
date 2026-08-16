import express from 'express';
import {
    CreateUserController,
    GetUserController,
    ListUsersController,
    SetUserRolesController,
    UpdateUserController,
} from '../apis/users/controllers/user.controllers';
import {
    CreateRoleController,
    ListPermissionsController,
    ListRolesController,
    SetRolePermissionsController,
} from '../apis/rbac/controllers/rbac.controllers';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

export default (app: express.Application) => {
    ListUsersController.get(app, '/api/v1/users', [authenticateJwt, requirePermission('users.read')]);
    GetUserController.get(app, '/api/v1/users/:id', [authenticateJwt, requirePermission('users.read')]);
    CreateUserController.post(app, '/api/v1/users', [authenticateJwt, requirePermission('users.create')]);
    UpdateUserController.patch(app, '/api/v1/users/:id', [authenticateJwt, requirePermission('users.update')]);
    SetUserRolesController.put(app, '/api/v1/users/:id/roles', [authenticateJwt, requirePermission('roles.manage')]);

    ListPermissionsController.get(app, '/api/v1/rbac/permissions', [authenticateJwt, requirePermission('roles.manage')]);
    ListRolesController.get(app, '/api/v1/rbac/roles', [authenticateJwt, requirePermission('roles.manage')]);
    CreateRoleController.post(app, '/api/v1/rbac/roles', [authenticateJwt, requirePermission('roles.manage')]);
    SetRolePermissionsController.put(app, '/api/v1/rbac/roles/:id/permissions', [authenticateJwt, requirePermission('roles.manage')]);
};
