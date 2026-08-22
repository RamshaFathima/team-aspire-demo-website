import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import Contact from './contact.model';

@Table({
    tableName: 'interactions',
    underscored: true,
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ['contact_id'] }],
})
export default class Interaction extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @ForeignKey(() => Contact)
    @Column({ type: DataType.UUID, allowNull: false })
    contactId: string;

    @Column({ type: DataType.STRING, allowNull: false })
    kind: string; // note | email | call | meeting | donation | enrollment | event | form

    @Column({ type: DataType.STRING, allowNull: false })
    subject: string;

    @Column({ type: DataType.TEXT, allowNull: true })
    detail: string;

    @Column({ type: DataType.DATE, allowNull: false, defaultValue: DataType.NOW })
    occurredAt: Date;

    @Column({ type: DataType.UUID, allowNull: true })
    createdBy: string;

    @BelongsTo(() => Contact, { onDelete: 'CASCADE' })
    contact: Contact;
}
