import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'audit_logs',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ['created_at'] }],
})
export default class AuditLog extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.UUID, allowNull: true })
    actorId: string;

    @Column({ type: DataType.STRING, allowNull: true })
    actorEmail: string;

    @Column({ type: DataType.STRING, allowNull: false })
    action: string; // donation.refund, user.role_change, ...

    @Column({ type: DataType.STRING, allowNull: false })
    resourceType: string;

    @Column({ type: DataType.STRING, allowNull: true })
    resourceId: string;

    @Column({ type: DataType.STRING, allowNull: true })
    ip: string;

    @Column({ type: DataType.STRING(512), allowNull: true })
    userAgent: string;

    @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
    metadata: Record<string, unknown>;
}
