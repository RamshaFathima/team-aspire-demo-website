import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'settings', underscored: true, timestamps: true, createdAt: false })
export default class Setting extends Model {
    @Column({ type: DataType.STRING, primaryKey: true })
    key: string; // site.name, donations.minAmount, features.lms

    @Column({ type: DataType.JSONB, allowNull: false })
    value: unknown;

    @Column({ type: DataType.STRING, allowNull: true })
    description: string;

    @Column({ type: DataType.UUID, allowNull: true })
    updatedBy: string;
}
