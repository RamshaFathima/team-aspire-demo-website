import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user.model';

@Table({
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ['user_id'] }],
})
export default class Notification extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    type: string; // donation.receipt, enrollment.confirmed, certificate.issued

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    body: string;

    @Column({ type: DataType.DATE, allowNull: true })
    readAt: Date;

    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    user: User;
}
