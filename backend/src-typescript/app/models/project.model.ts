import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import ProjectUpdate from './project.update.model';

@Table({ tableName: 'projects', underscored: true, timestamps: true })
export default class Project extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    slug: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING(600), allowNull: true })
    summary: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    description: string;

    @Column({ type: DataType.STRING, allowNull: true })
    category: string; // education | welfare | health | water | food

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'draft' })
    status: string; // draft | active | completed | archived

    @Column({ type: DataType.STRING, allowNull: true })
    location: string;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: true })
    goalAmount: string;

    @Column({ type: DataType.DECIMAL(12, 2), allowNull: false, defaultValue: 0 })
    raisedAmount: string;

    @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
    impactStats: { label: string; value: string }[];

    @Column({ type: DataType.STRING, allowNull: true })
    coverImage: string;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    featured: boolean;

    @Column({ type: DataType.DATE, allowNull: true })
    startedAt: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    publishedAt: Date;

    @HasMany(() => ProjectUpdate)
    updates: ProjectUpdate[];
}
