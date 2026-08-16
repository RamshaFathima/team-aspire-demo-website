import { Op } from 'sequelize';
import User from '../../../models/user.model';
import Role from '../../../models/role.model';
import UserRole from '../../../models/user.role.model';
import EncryptionUtil from '../../../utils/EncryptionUtil';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';
import { invalidateUserContext } from '../../../middlewares/permission.middleware';
import { sequelize } from '../../../../config/sequelizeConfig';

const publicAttrs = { exclude: ['passwordHash'] };

class UserService {
    async list(query: { page?: number; limit?: number; search?: string; status?: string; role?: string }) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));

        const where: any = {};
        if (query.search) {
            where[Op.or as any] = [
                { fullName: { [Op.iLike]: `%${query.search}%` } },
                { email: { [Op.iLike]: `%${query.search}%` } },
            ];
        }
        if (query.status) where.status = query.status;

        const { rows, count } = await User.findAndCountAll({
            where,
            attributes: publicAttrs,
            include: [{ model: UserRole, include: [Role] }],
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
            distinct: true,
        });

        let data = rows.map((u) => ({
            ...u.get({ plain: true }),
            roles: u.userRoles?.map((ur) => ur.role?.key).filter(Boolean) ?? [],
            userRoles: undefined,
        }));
        if (query.role) {
            data = data.filter((u: any) => u.roles.includes(query.role));
        }
        return { data, page, limit, total: count };
    }

    async get(id: string) {
        const user = await User.findByPk(id, {
            attributes: publicAttrs,
            include: [{ model: UserRole, include: [Role] }],
        });
        if (!user) throw new ValidationError('User not found', StatusCodes.NOT_FOUND);
        return {
            ...user.get({ plain: true }),
            roles: user.userRoles?.map((ur) => ({ key: ur.role?.key, name: ur.role?.name })) ?? [],
            userRoles: undefined,
        };
    }

    async create(data: {
        fullName: string;
        email: string;
        password: string;
        phone?: string;
        roleKeys?: string[];
    }) {
        const existing = await User.findOne({ where: { email: data.email.toLowerCase() } });
        if (existing) throw new ValidationError('Email already in use', StatusCodes.CONFLICT);

        const user = await User.create({
            fullName: data.fullName,
            email: data.email.toLowerCase(),
            phone: data.phone ?? null,
            passwordHash: await EncryptionUtil.hashPassword(data.password),
        } as any);

        if (data.roleKeys?.length) {
            const roles = await Role.findAll({ where: { key: data.roleKeys } });
            await UserRole.bulkCreate(
                roles.map((r) => ({ userId: user.id, roleId: r.id })) as any[]
            );
        }
        return { id: user.id, email: user.email, fullName: user.fullName };
    }

    async update(
        id: string,
        data: { fullName?: string; phone?: string | null; status?: string; password?: string }
    ) {
        const user = await User.findByPk(id);
        if (!user) throw new ValidationError('User not found', StatusCodes.NOT_FOUND);

        const patch: any = {};
        if (data.fullName !== undefined) patch.fullName = data.fullName;
        if (data.phone !== undefined) patch.phone = data.phone;
        if (data.status !== undefined) patch.status = data.status;
        if (data.password) patch.passwordHash = await EncryptionUtil.hashPassword(data.password);

        await user.update(patch);
        await invalidateUserContext(id);
        const { passwordHash: _ph, ...rest } = user.get({ plain: true }) as any;
        return rest;
    }

    async setRoles(id: string, roleKeys: string[]) {
        const user = await User.findByPk(id);
        if (!user) throw new ValidationError('User not found', StatusCodes.NOT_FOUND);

        const roles = roleKeys.length ? await Role.findAll({ where: { key: roleKeys } }) : [];
        await sequelize.transaction(async (t) => {
            await UserRole.destroy({ where: { userId: id }, transaction: t });
            if (roles.length) {
                await UserRole.bulkCreate(
                    roles.map((r) => ({ userId: id, roleId: r.id })) as any[],
                    { transaction: t }
                );
            }
        });
        await invalidateUserContext(id);
        return { ok: true, roles: roles.map((r) => r.key) };
    }
}

export default new UserService();
