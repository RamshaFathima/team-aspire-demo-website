import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Project from './project.model';

@Table({ tableName: 'campaigns', underscored: true, timestamps: true, updatedAt: false })
export default class Campaign extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    slug: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    description: string;

    @ForeignKey(() => Project)
    @Column({ type: DataType.UUID, allowNull: true })
    projectId: string;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
    goalAmount: string;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
    raisedAmount: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'active' })
    status: string; // active | completed | archived

    @Column({ type: DataType.DATE, allowNull: true })
    startsAt: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    endsAt: Date;

    @BelongsTo(() => Project, { onDelete: 'SET NULL' })
    project: Project;
}
