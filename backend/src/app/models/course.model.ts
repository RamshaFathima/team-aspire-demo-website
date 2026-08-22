import { Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import User from './user.model';
import CourseModule from './course.module.model';
import Cohort from './cohort.model';

@Table({ tableName: 'courses', underscored: true, timestamps: true })
export default class Course extends Model {
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
    category: string; // deen | skills | wellbeing

    @Column({ type: DataType.STRING, allowNull: true, defaultValue: 'beginner' })
    level: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'draft' })
    status: string; // draft | review | published | archived

    @Column({ type: DataType.STRING, allowNull: true })
    coverImage: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    durationWeeks: number;

    @Column({ type: DataType.INTEGER, allowNull: true })
    capacity: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
    isOnline: boolean;

    @Column({ type: DataType.STRING, allowNull: true })
    meetingPlatform: string; // Zoom, Google Meet, In-person

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    certificateEnabled: boolean;

    @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: 80 })
    minAttendancePct: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true })
    createdBy: string;

    @Column({ type: DataType.DATE, allowNull: true })
    publishedAt: Date;

    @HasMany(() => CourseModule)
    modules: CourseModule[];

    @HasMany(() => Cohort)
    cohorts: Cohort[];
}
