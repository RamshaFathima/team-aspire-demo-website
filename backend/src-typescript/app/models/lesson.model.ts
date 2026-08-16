import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import CourseModule from './course.module.model';

@Table({ tableName: 'lessons', underscored: true, timestamps: false })
export default class Lesson extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => CourseModule)
    @Column({ type: DataType.UUID, allowNull: false })
    moduleId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    content: string;

    @Column({ type: DataType.STRING, allowNull: true })
    materialUrl: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    position: number;

    @BelongsTo(() => CourseModule, { onDelete: 'CASCADE' })
    module: CourseModule;
}
