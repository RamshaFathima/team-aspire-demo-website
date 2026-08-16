import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user.model';
import Role from './role.model';

@Table({ tableName: 'user_roles', underscored: true, timestamps: false })
export default class UserRole extends Model {
    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, primaryKey: true })
    userId: string;

    @ForeignKey(() => Role)
    @Column({ type: DataType.UUID, primaryKey: true })
    roleId: string;

    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    user: User;

    @BelongsTo(() => Role, { onDelete: 'CASCADE' })
    role: Role;
}
