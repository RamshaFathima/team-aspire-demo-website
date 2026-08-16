import User from '../../../models/user.model';
import Role from '../../../models/role.model';
import UserRole from '../../../models/user.role.model';
import EncryptionUtil from '../../../utils/EncryptionUtil';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';
import { ensureContact } from '../../../utils/CrmUtil';
import { auditDirect } from '../../../utils/AuditUtil';
import {
    IUserContext,
    invalidateUserContext,
    loadUserContext,
} from '../../../middlewares/permission.middleware';
import { IChangePasswordBody, ILoginBody, IRegisterBody, IUpdateMeBody } from '../interfaces';

class AuthService {
    private publicUser(user: User, ctx?: IUserContext | null) {
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            status: user.status,
            roles: ctx?.roles ?? [],
            permissions: ctx?.permissions ?? [],
            createdAt: user.createdAt,
        };
    }

    async register(data: IRegisterBody) {
        const existing = await User.findOne({ where: { email: data.email.toLowerCase() } });
        if (existing) {
            throw new ValidationError('An account with this email already exists', StatusCodes.CONFLICT);
        }

        const user = await User.create({
            email: data.email.toLowerCase(),
            fullName: data.fullName,
            phone: data.phone ?? null,
            passwordHash: await EncryptionUtil.hashPassword(data.password),
        } as any);

        const memberRole = await Role.findOne({ where: { key: 'MEMBER' } });
        if (memberRole) {
            await UserRole.create({ userId: user.id, roleId: memberRole.id } as any);
        }

        await ensureContact({
            userId: user.id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            type: 'other',
        });

        auditDirect(
            { id: user.id, email: user.email },
            { action: 'auth.register', resourceType: 'user', resourceId: user.id }
        );

        const tokens = await EncryptionUtil.generateJwtTokens({
            sub: user.id,
            email: user.email,
            fullName: user.fullName,
        });
        const ctx = await loadUserContext(user.id);
        return { user: this.publicUser(user, ctx), ...tokens };
    }

    async login(data: ILoginBody) {
        const user = await User.findOne({ where: { email: data.email.toLowerCase() } });
        if (!user || !(await EncryptionUtil.comparePassword(data.password, user.passwordHash))) {
            throw new ValidationError('Invalid email or password', StatusCodes.UNAUTHORISED);
        }
        if (user.status !== 'active') {
            throw new ValidationError('Account is suspended', StatusCodes.UNAUTHORISED);
        }

        const tokens = await EncryptionUtil.generateJwtTokens({
            sub: user.id,
            email: user.email,
            fullName: user.fullName,
        });
        const ctx = await loadUserContext(user.id);
        auditDirect(
            { id: user.id, email: user.email },
            { action: 'auth.login', resourceType: 'user', resourceId: user.id }
        );
        return { user: this.publicUser(user, ctx), ...tokens };
    }

    async refresh(refreshToken: string) {
        let payload: Record<string, any>;
        try {
            payload = await EncryptionUtil.verifyToken(refreshToken);
        } catch {
            throw new ValidationError('Session expired, please log in again', StatusCodes.UNAUTHORISED);
        }
        const user = await User.findByPk(payload.sub as string);
        if (!user || user.status !== 'active') {
            throw new ValidationError('Account not found or suspended', StatusCodes.UNAUTHORISED);
        }
        return EncryptionUtil.generateJwtTokens({
            sub: user.id,
            email: user.email,
            fullName: user.fullName,
        });
    }

    async me(userId: string) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new ValidationError('Account not found', StatusCodes.UNAUTHORISED);
        }
        const ctx = await loadUserContext(userId);
        return this.publicUser(user, ctx);
    }

    async updateMe(userId: string, data: IUpdateMeBody) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw new ValidationError('Account not found', StatusCodes.NOT_FOUND);
        }
        await user.update({
            ...(data.fullName !== undefined && { fullName: data.fullName }),
            ...(data.phone !== undefined && { phone: data.phone }),
        });
        await invalidateUserContext(userId);
        return this.me(userId);
    }

    async changePassword(userId: string, data: IChangePasswordBody) {
        const user = await User.findByPk(userId);
        if (!user || !(await EncryptionUtil.comparePassword(data.currentPassword, user.passwordHash))) {
            throw new ValidationError('Current password is incorrect');
        }
        await user.update({ passwordHash: await EncryptionUtil.hashPassword(data.newPassword) });
        return { ok: true };
    }
}

export default new AuthService();
