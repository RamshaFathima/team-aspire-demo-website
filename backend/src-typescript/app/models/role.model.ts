import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import RolePermission from './role.permission.model';

@Table({ tableName: 'roles', underscored: true, timestamps: true, updatedAt: false })
export default class Role extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    key: string; // SUPER_ADMIN, ADMIN, ...

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: true })
    description: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isSystem: boolean;

    @HasMany(() => RolePermission)
    rolePermissions: RolePermission[];
}
