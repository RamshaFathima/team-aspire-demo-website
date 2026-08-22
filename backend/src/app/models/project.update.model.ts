import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Project from './project.model';
import User from './user.model';

@Table({ tableName: 'project_updates', underscored: true, timestamps: true, updatedAt: false })
export default class ProjectUpdate extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => Project)
    @Column({ type: DataType.UUID, allowNull: false })
    projectId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    body: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    createdBy: string;

    @BelongsTo(() => Project, { onDelete: 'CASCADE' })
    project: Project;
}
