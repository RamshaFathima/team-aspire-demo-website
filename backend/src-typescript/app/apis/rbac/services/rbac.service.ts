import Role from '../../../models/role.model';
import Permission from '../../../models/permission.model';
import RolePermission from '../../../models/role.permission.model';
import UserRole from '../../../models/user.role.model';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';
import { invalidateManyUserContexts } from '../../../middlewares/permission.middleware';
import { sequelize } from '../../../../config/sequelizeConfig';

class RbacService {
    async listPermissions() {
        return Permission.findAll({ order: [['key', 'ASC']] });
    }

    async listRoles() {
        const roles = await Role.findAll({
            include: [{ model: RolePermission, include: [Permission] }],
            order: [['name', 'ASC']],
        });
        return roles.map((r) => ({
            ...r.get({ plain: true }),
            permissions: r.rolePermissions?.map((rp) => rp.permission?.key).filter(Boolean) ?? [],
            rolePermissions: undefined,
        }));
    }

    async createRole(data: {
        key: string;
        name: string;
        description?: string;
        permissionKeys?: string[];
    }) {
        const existing = await Role.findOne({ where: { key: data.key } });
        if (existing) throw new ValidationError('Role key already exists', StatusCodes.CONFLICT);

        const role = await Role.create({
            key: data.key,
            name: data.name,
            description: data.description ?? null,
        } as any);

        if (data.permissionKeys?.length) {
            const perms = await Permission.findAll({ where: { key: data.permissionKeys } });
            await RolePermission.bulkCreate(
                perms.map((p) => ({ roleId: role.id, permissionId: p.id })) as any[]
            );
        }
        return role;
    }

    async setRolePermissions(roleId: string, permissionKeys: string[]) {
        const role = await Role.findByPk(roleId);
        if (!role) throw new ValidationError('Role not found', StatusCodes.NOT_FOUND);
        if (role.key === 'SUPER_ADMIN') {
            throw new ValidationError('SUPER_ADMIN grants cannot be edited');
        }

        const perms = permissionKeys.length
            ? await Permission.findAll({ where: { key: permissionKeys } })
            : [];

        await sequelize.transaction(async (t) => {
            await RolePermission.destroy({ where: { roleId }, transaction: t });
            if (perms.length) {
                await RolePermission.bulkCreate(
                    perms.map((p) => ({ roleId, permissionId: p.id })) as any[],
                    { transaction: t }
                );
            }
        });

        const members = await UserRole.findAll({ where: { roleId } });
        await invalidateManyUserContexts(members.map((m) => m.userId));
        return { ok: true };
    }
}

export default new RbacService();
