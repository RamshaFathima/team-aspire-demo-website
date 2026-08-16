import { Op } from 'sequelize';
import Project from '../../../models/project.model';
import ProjectUpdate from '../../../models/project.update.model';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';
import { slugify } from '../../../utils/Ids';

class ProjectService {
    async list(query: { page?: number; limit?: number; search?: string; status?: string }) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
        const where: any = {};
        if (query.status) where.status = query.status;
        if (query.search) where.title = { [Op.iLike]: `%${query.search}%` };

        const { rows, count } = await Project.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });
        return { data: rows, page, limit, total: count };
    }

    async get(id: string) {
        const project = await Project.findByPk(id, {
            include: [{ model: ProjectUpdate }],
            order: [[{ model: ProjectUpdate, as: 'updates' }, 'createdAt', 'DESC']],
        });
        if (!project) throw new ValidationError('Project not found', StatusCodes.NOT_FOUND);
        return project;
    }

    async create(data: any) {
        const slug = slugify(data.slug || data.title);
        const existing = await Project.findOne({ where: { slug } });
        if (existing) throw new ValidationError(`Slug "${slug}" is already used`, StatusCodes.CONFLICT);
        return Project.create({ ...data, slug } as any);
    }

    async update(id: string, data: any) {
        const project = await Project.findByPk(id);
        if (!project) throw new ValidationError('Project not found', StatusCodes.NOT_FOUND);
        const patch = { ...data };
        if (data.slug) patch.slug = slugify(data.slug);
        await project.update(patch);
        return project;
    }

    async setStatus(id: string, status: string) {
        const project = await Project.findByPk(id);
        if (!project) throw new ValidationError('Project not found', StatusCodes.NOT_FOUND);
        await project.update({
            status,
            publishedAt: status === 'active' && !project.publishedAt ? new Date() : project.publishedAt,
        });
        return project;
    }

    async addUpdate(projectId: string, data: { title: string; body?: string }, createdBy: string) {
        const project = await Project.findByPk(projectId);
        if (!project) throw new ValidationError('Project not found', StatusCodes.NOT_FOUND);
        return ProjectUpdate.create({ projectId, title: data.title, body: data.body ?? null, createdBy } as any);
    }

    async deleteUpdate(updateId: string) {
        await ProjectUpdate.destroy({ where: { id: updateId } });
        return { ok: true };
    }
}

export default new ProjectService();
