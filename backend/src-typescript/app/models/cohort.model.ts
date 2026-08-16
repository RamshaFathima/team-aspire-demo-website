import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import Course from './course.model';
import ClassSession from './class.session.model';
import Enrollment from './enrollment.model';

@Table({ tableName: 'cohorts', underscored: true, timestamps: true, updatedAt: false })
export default class Cohort extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => Course)
    @Column({ type: DataType.UUID, allowNull: false })
    courseId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    code: string; // SEERAH-2026-A

    @Column({ type: DataType.DATE, allowNull: true })
    startsOn: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    endsOn: Date;

    @Column({ type: DataType.STRING, allowNull: true })
    scheduleNote: string; // "Every Sunday 11:00–12:30"

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'upcoming' })
    status: string; // upcoming | active | completed

    @Column({ type: DataType.INTEGER, allowNull: true })
    capacity: number;

    @BelongsTo(() => Course, { onDelete: 'CASCADE' })
    course: Course;

    @HasMany(() => ClassSession)
    sessions: ClassSession[];

    @HasMany(() => Enrollment)
    enrollments: Enrollment[];
}
