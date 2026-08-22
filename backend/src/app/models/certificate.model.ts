import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user.model';
import Course from './course.model';
import Cohort from './cohort.model';

@Table({ tableName: 'certificates', underscored: true, timestamps: false })
export default class Certificate extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    certificateNumber: string; // ASP-CERT-2026-000123

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    verificationCode: string; // short public token

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    userId: string;

    @ForeignKey(() => Course)
    @Column({ type: DataType.UUID, allowNull: true })
    courseId: string;

    @ForeignKey(() => Cohort)
    @Column({ type: DataType.UUID, allowNull: true })
    cohortId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    description: string;

    @Column({ type: DataType.UUID, allowNull: true })
    issuedBy: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    issuedAt: Date;

    @Column({ type: DataType.DATE, allowNull: true })
    expiresAt: Date;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'active' })
    status: string; // active | revoked

    @Column({ type: DataType.STRING, allowNull: true })
    revokedReason: string;

    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    holder: User;

    @BelongsTo(() => Course, { onDelete: 'SET NULL' })
    course: Course;

    @BelongsTo(() => Cohort, { onDelete: 'SET NULL' })
    cohort: Cohort;
}
