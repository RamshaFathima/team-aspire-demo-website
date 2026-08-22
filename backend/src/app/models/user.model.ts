import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import UserRole from './user.role.model';

@Table({ tableName: 'users', underscored: true, timestamps: true })
export default class User extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email: string;

    @Column({ type: DataType.STRING, allowNull: false })
    passwordHash: string;

    @Column({ type: DataType.STRING, allowNull: false })
    fullName: string;

    @Column({ type: DataType.STRING, allowNull: true })
    phone: string;

    @Column({ type: DataType.STRING, allowNull: true })
    avatarUrl: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    signatureUrl: string; // data-URL image, shown on certificates they teach

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'active' })
    status: string; // active | suspended

    @Column({ type: DataType.DATE, allowNull: true })
    emailVerifiedAt: Date;

    @HasMany(() => UserRole)
    userRoles: UserRole[];
}
