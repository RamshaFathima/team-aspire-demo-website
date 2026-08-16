import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Cohort from './cohort.model';
import User from './user.model';

@Table({
    tableName: 'class_sessions',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ['cohort_id'] }],
})
export default class ClassSession extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => Cohort)
    @Column({ type: DataType.UUID, allowNull: false })
    cohortId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, allowNull: true })
    topic: string;

    @Column({ type: DataType.DATE, allowNull: false })
    startsAt: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    endsAt: Date;

    @Column({ type: DataType.STRING, allowNull: true })
    location: string;

    @Column({ type: DataType.STRING, allowNull: true })
    meetingUrl: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    teacherId: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'scheduled' })
    status: string; // scheduled | completed | cancelled

    @BelongsTo(() => Cohort, { onDelete: 'CASCADE' })
    cohort: Cohort;

    @BelongsTo(() => User, { onDelete: 'SET NULL' })
    teacher: User;
}
