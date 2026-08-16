import Page from '../../../models/page.model';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';
import { slugify } from '../../../utils/Ids';

class CmsService {
    async listPages() {
        return Page.findAll({ order: [['updatedAt', 'DESC']] });
    }

    async getPage(id: string) {
        const page = await Page.findByPk(id);
        if (!page) throw new ValidationError('Page not found', StatusCodes.NOT_FOUND);
        return page;
    }

    async createPage(data: any, updatedBy: string) {
        const slug = slugify(data.slug || data.title);
        if (await Page.findOne({ where: { slug } })) {
            throw new ValidationError(`Slug "${slug}" already used`, StatusCodes.CONFLICT);
        }
        return Page.create({
            title: data.title,
            slug,
            blocks: data.blocks ?? [],
            seo: data.seo ?? {},
            updatedBy,
        } as any);
    }

    async updatePage(id: string, data: any, updatedBy: string) {
        const page = await Page.findByPk(id);
        if (!page) throw new ValidationError('Page not found', StatusCodes.NOT_FOUND);
        const patch: any = { ...data, updatedBy };
        if (data.slug) patch.slug = slugify(data.slug);
        await page.update(patch);
        return page;
    }

    async setPublish(id: string, publish: boolean, updatedBy: string) {
        const page = await Page.findByPk(id);
        if (!page) throw new ValidationError('Page not found', StatusCodes.NOT_FOUND);
        await page.update({
            status: publish ? 'published' : 'draft',
            publishedAt: publish ? (page.publishedAt ?? new Date()) : page.publishedAt,
            updatedBy,
        });
        return page;
    }
}

export default new CmsService();
