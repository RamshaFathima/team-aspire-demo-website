import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import User from './user.model';
import Interaction from './interaction.model';

@Table({ tableName: 'contacts', underscored: true, timestamps: true })
export default class Contact extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.UUID, allowNull: true, unique: true })
    userId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    fullName: string;

    @Column({ type: DataType.STRING, allowNull: true })
    email: string;

    @Column({ type: DataType.STRING, allowNull: true })
    phone: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'other' })
    type: string; // donor | volunteer | student | teacher | partner | other

    @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false, defaultValue: [] })
    tags: string[];

    @Column({ type: DataType.TEXT, allowNull: true })
    notes: string;

    @BelongsTo(() => User, { onDelete: 'SET NULL' })
    user: User;

    @HasMany(() => Interaction)
    interactions: Interaction[];
}
