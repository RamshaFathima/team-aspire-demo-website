import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user.model';
import Course from './course.model';
import Cohort from './cohort.model';

@Table({
    tableName: 'enrollments',
    underscored: true,
    timestamps: false,
    indexes: [{ unique: true, fields: ['user_id', 'cohort_id'] }],
})
export default class Enrollment extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId: string;

    @ForeignKey(() => Course)
    @Column({ type: DataType.UUID, allowNull: false })
    courseId: string;

    @ForeignKey(() => Cohort)
    @Column({ type: DataType.UUID, allowNull: false })
    cohortId: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'active' })
    status: string; // pending | active | completed | dropped

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    progress: number;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    enrolledAt: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    completedAt: Date;

    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    user: User;

    @BelongsTo(() => Course, { onDelete: 'CASCADE' })
    course: Course;

    @BelongsTo(() => Cohort, { onDelete: 'CASCADE' })
    cohort: Cohort;
}
