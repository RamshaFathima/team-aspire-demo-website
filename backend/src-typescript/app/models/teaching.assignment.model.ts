import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import User from './user.model';
import Cohort from './cohort.model';

@Table({
    tableName: 'teaching_assignments',
    underscored: true,
    timestamps: false,
    indexes: [{ unique: true, fields: ['teacher_id', 'cohort_id'] }],
})
export default class TeachingAssignment extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    teacherId: string;

    @ForeignKey(() => Cohort)
    @Column({ type: DataType.UUID, allowNull: false })
    cohortId: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'instructor' })
    role: string; // instructor | assistant

    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    teacher: User;

    @BelongsTo(() => Cohort, { onDelete: 'CASCADE' })
    cohort: Cohort;
}
