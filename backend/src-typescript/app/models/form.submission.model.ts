import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'form_submissions', underscored: true, timestamps: true, updatedAt: false })
export default class FormSubmission extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false })
    kind: string; // contact | volunteer

    @Column({ type: DataType.JSONB, allowNull: false })
    payload: Record<string, string>;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'new' })
    status: string; // new | reviewed | closed
}
