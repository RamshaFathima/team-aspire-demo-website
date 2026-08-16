import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Role from './role.model';
import Permission from './permission.model';

@Table({ tableName: 'role_permissions', underscored: true, timestamps: false })
export default class RolePermission extends Model {
    @ForeignKey(() => Role)
    @Column({ type: DataType.UUID, primaryKey: true })
    roleId: string;

    @ForeignKey(() => Permission)
    @Column({ type: DataType.UUID, primaryKey: true })
    permissionId: string;

    @BelongsTo(() => Role, { onDelete: 'CASCADE' })
    role: Role;

    @BelongsTo(() => Permission, { onDelete: 'CASCADE' })
    permission: Permission;
}
