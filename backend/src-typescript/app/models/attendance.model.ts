import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import ClassSession from './class.session.model';
import User from './user.model';

@Table({
    tableName: 'attendance',
    underscored: true,
    timestamps: false,
    indexes: [{ unique: true, fields: ['session_id', 'student_id'] }],
})
export default class Attendance extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => ClassSession)
    @Column({ type: DataType.UUID, allowNull: false })
    sessionId: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: false })
    studentId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    status: string; // present | absent | late | excused

    @Column({ type: DataType.UUID, allowNull: true })
    markedBy: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    markedAt: Date;

    @BelongsTo(() => ClassSession, { onDelete: 'CASCADE' })
    session: ClassSession;

    @BelongsTo(() => User, { onDelete: 'CASCADE' })
    student: User;
}
