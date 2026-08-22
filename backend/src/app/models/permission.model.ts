import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'permissions', underscored: true, timestamps: false })
export default class Permission extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    key: string; // donations.read

    @Column({ type: DataType.STRING, allowNull: true })
    description: string;
}
