import { Op } from 'sequelize';
import Contact from '../../../models/contact.model';
import Interaction from '../../../models/interaction.model';
import Donation from '../../../models/donation.model';
import Enrollment from '../../../models/enrollment.model';
import Certificate from '../../../models/certificate.model';
import Course from '../../../models/course.model';
import Cohort from '../../../models/cohort.model';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';

class CrmService {
    async listContacts(query: { page?: number; limit?: number; search?: string; type?: string }) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
        const where: any = {};
        if (query.type) where.type = query.type;
        if (query.search) {
            where[Op.or as any] = [
                { fullName: { [Op.iLike]: `%${query.search}%` } },
                { email: { [Op.iLike]: `%${query.search}%` } },
            ];
        }
        const { rows, count } = await Contact.findAndCountAll({
            where,
            order: [['updatedAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });
        return { data: rows, page, limit, total: count };
    }

    /** Person 360 — contact + donations + enrollments + certificates + timeline. */
    async person360(id: string) {
        const contact = await Contact.findByPk(id);
        if (!contact) throw new ValidationError('Contact not found', StatusCodes.NOT_FOUND);

        const timeline = await Interaction.findAll({
            where: { contactId: id },
            order: [['occurredAt', 'DESC']],
            limit: 100,
        });

        let donations: Donation[] = [];
        let enrollments: any[] = [];
        let certificates: Certificate[] = [];

        if (contact.email) {
            donations = await Donation.findAll({
                where: { donorEmail: contact.email },
                order: [['createdAt', 'DESC']],
                limit: 50,
            });
        }
        if (contact.userId) {
            const enrollmentRows = await Enrollment.findAll({
                where: { userId: contact.userId },
                include: [
                    { model: Course, attributes: ['title'] },
                    { model: Cohort, attributes: ['name'] },
                ],
                order: [['enrolledAt', 'DESC']],
            });
            enrollments = enrollmentRows.map((e) => ({
                ...e.get({ plain: true }),
                courseTitle: e.course?.title,
                cohortName: e.cohort?.name,
                course: undefined,
                cohort: undefined,
            }));
            certificates = await Certificate.findAll({
                where: { userId: contact.userId },
                order: [['issuedAt', 'DESC']],
            });
        }

        const totalDonated = donations
            .filter((d) => d.status === 'success')
            .reduce((sum, d) => sum + Number(d.amount), 0);

        return {
            ...contact.get({ plain: true }),
            totalDonated,
            donations,
            enrollments,
            certificates,
            timeline,
        };
    }

    async createContact(data: any) {
        return Contact.create(data);
    }

    async updateContact(id: string, data: any) {
        const contact = await Contact.findByPk(id);
        if (!contact) throw new ValidationError('Contact not found', StatusCodes.NOT_FOUND);
        await contact.update(data);
        return contact;
    }

    async addInteraction(contactId: string, data: any, createdBy: string) {
        if (!(await Contact.findByPk(contactId))) {
            throw new ValidationError('Contact not found', StatusCodes.NOT_FOUND);
        }
        return Interaction.create({
            contactId,
            kind: data.kind,
            subject: data.subject,
            detail: data.detail ?? null,
            occurredAt: data.occurredAt ?? new Date(),
            createdBy,
        } as any);
    }

    async removeContact(id: string) {
        const contact = await Contact.findByPk(id);
        if (!contact) throw new ValidationError('Contact not found', StatusCodes.NOT_FOUND);
        await contact.destroy(); // interactions cascade
        return { ok: true, name: contact.fullName };
    }
}

export default new CrmService();
