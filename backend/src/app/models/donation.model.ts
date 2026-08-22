import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user.model';
import Project from './project.model';
import Campaign from './campaign.model';

@Table({
    tableName: 'donations',
    underscored: true,
    timestamps: true,
    indexes: [
        { fields: ['status'] },
        { fields: ['donor_email'] },
        { fields: ['project_id'] },
    ],
})
export default class Donation extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    donorName: string;

    @Column({ type: DataType.STRING, allowNull: false })
    donorEmail: string;

    @Column({ type: DataType.STRING, allowNull: true })
    donorPhone: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    userId: string;

    @ForeignKey(() => Project)
    @Column({ type: DataType.UUID, allowNull: true })
    projectId: string;

    @ForeignKey(() => Campaign)
    @Column({ type: DataType.UUID, allowNull: true })
    campaignId: string;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
    amount: string;

    @Column({ type: DataType.STRING(8), allowNull: false, defaultValue: 'INR' })
    currency: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'one_time' })
    frequency: string; // one_time | monthly

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'initiated' })
    status: string; // initiated | pending | success | failed | refunded

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'mock_upi' })
    method: string; // mock_upi | mock_card | bank_transfer

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    gatewayRef: string; // idempotency key

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    isAnonymous: boolean;

    @Column({ type: DataType.TEXT, allowNull: true })
    message: string;

    @Column({ type: DataType.STRING, allowNull: true, unique: true })
    receiptNumber: string;

    @Column({ type: DataType.DATE, allowNull: true })
    receiptedAt: Date;

    @Column({ type: DataType.STRING, allowNull: true })
    refundReason: string;

    @BelongsTo(() => User, { onDelete: 'SET NULL' })
    user: User;

    @BelongsTo(() => Project, { onDelete: 'SET NULL' })
    project: Project;

    @BelongsTo(() => Campaign, { onDelete: 'SET NULL' })
    campaign: Campaign;
}
