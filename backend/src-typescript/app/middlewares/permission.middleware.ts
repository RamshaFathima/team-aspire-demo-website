import { NextFunction, Response } from 'express';
import { AuthedRequest } from './auth.middleware';
import { cacheClient } from '../common/redis.client';
import User from '../models/user.model';
import UserRole from '../models/user.role.model';
import Role from '../models/role.model';
import RolePermission from '../models/role.permission.model';
import Permission from '../models/permission.model';
import { createLogger } from '../utils/Logger';

const log = createLogger('rbac');

const CTX_TTL_SECONDS = 60;
const ctxKey = (userId: string) => `aspire:userctx:${userId}`;

export interface IUserContext {
    id: string;
    email: string;
    fullName: string;
    roles: string[];
    permissions: string[];
}

export interface PermissionedRequest extends AuthedRequest {
    userCtx?: IUserContext;
}

/** Resolve a user's roles + permissions, with a short Redis cache. */
export const loadUserContext = async (userId: string): Promise<IUserContext | null> => {
    try {
        const cached = await cacheClient.get(ctxKey(userId));
        if (cached) return JSON.parse(cached) as IUserContext;
    } catch (err) {
        log.warn({ err }, 'userctx cache read failed');
    }

    const user = await User.findByPk(userId);
    if (!user || user.status !== 'active') return null;

    const userRoles = await UserRole.findAll({ where: { userId }, include: [Role] });
    const roleIds = userRoles.map((ur) => ur.roleId);

    let permissions: string[] = [];
    if (roleIds.length) {
        const grants = await RolePermission.findAll({
            where: { roleId: roleIds },
            include: [Permission],
        });
        permissions = [...new Set(grants.map((g) => g.permission?.key).filter(Boolean))] as string[];
    }

    const ctx: IUserContext = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: userRoles.map((ur) => ur.role?.key).filter(Boolean) as string[],
        permissions,
    };

    cacheClient
        .setex(ctxKey(userId), CTX_TTL_SECONDS, JSON.stringify(ctx))
        .catch((err) => log.warn({ err }, 'userctx cache write failed'));

    return ctx;
};

export const invalidateUserContext = async (userId: string): Promise<void> => {
    await cacheClient.del(ctxKey(userId)).catch(() => undefined);
};

export const invalidateManyUserContexts = async (userIds: string[]): Promise<void> => {
    if (!userIds.length) return;
    await cacheClient.del(...userIds.map(ctxKey)).catch(() => undefined);
};

/**
 * Middleware factory: allow only users holding `perm`.
 * Must run AFTER authenticateJwt (relies on req.user.sub).
 */
export const requirePermission =
    (perm: string) => async (req: PermissionedRequest, res: Response, next: NextFunction) => {
        const userId = req.user?.sub as string | undefined;
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const ctx = await loadUserContext(userId);
        if (!ctx) {
            return res.status(401).json({ error: 'Account not found or suspended' });
        }
        req.userCtx = ctx;
        if (!ctx.permissions.includes(perm)) {
            return res.status(403).json({ error: `Missing permission: ${perm}` });
        }
        return next();
    };

/** Attach userCtx without enforcing a specific permission (any logged-in user). */
export const attachUserContext = async (
    req: PermissionedRequest,
    res: Response,
    next: NextFunction
) => {
    const userId = req.user?.sub as string | undefined;
    if (!userId) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    const ctx = await loadUserContext(userId);
    if (!ctx) {
        return res.status(401).json({ error: 'Account not found or suspended' });
    }
    req.userCtx = ctx;
    return next();
};
