import { Column, DataType, Model, Table } from 'sequelize-typescript';

export type PageBlock =
    | {
          type: 'hero';
          heading: string;
          subheading?: string;
          ctaLabel?: string;
          ctaHref?: string;
          image?: string;
      }
    | { type: 'richText'; heading?: string; body: string }
    | { type: 'stats'; items: { label: string; value: string }[] }
    | { type: 'cta'; heading: string; body?: string; ctaLabel: string; ctaHref: string }
    | { type: 'faq'; items: { q: string; a: string }[] };

@Table({ tableName: 'pages', underscored: true, timestamps: true })
export default class Page extends Model {
    @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
    id: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    slug: string;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.JSONB, allowNull: false, defaultValue: [] })
    blocks: PageBlock[];

    @Column({ type: DataType.JSONB, allowNull: false, defaultValue: {} })
    seo: { title?: string; description?: string };

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: 'draft' })
    status: string; // draft | published

    @Column({ type: DataType.DATE, allowNull: true })
    publishedAt: Date;

    @Column({ type: DataType.UUID, allowNull: true })
    updatedBy: string;
}
