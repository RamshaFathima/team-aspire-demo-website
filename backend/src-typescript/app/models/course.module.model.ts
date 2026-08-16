import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import Course from './course.model';
import Lesson from './lesson.model';

@Table({ tableName: 'course_modules', underscored: true, timestamps: false })
export default class CourseModule extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => Course)
    @Column({ type: DataType.UUID, allowNull: false })
    courseId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    position: number;

    @BelongsTo(() => Course, { onDelete: 'CASCADE' })
    course: Course;

    @HasMany(() => Lesson)
    lessons: Lesson[];
}
