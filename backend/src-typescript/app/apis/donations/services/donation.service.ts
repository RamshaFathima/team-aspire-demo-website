import { Op } from 'sequelize';
import Donation from '../../../models/donation.model';
import Project from '../../../models/project.model';
import Campaign from '../../../models/campaign.model';
import { ValidationError } from '../../../handlers/CustomErrorHandler';
import { StatusCodes } from '../../../enums/StatusCodes';
import { makeReceiptNumber, slugify } from '../../../utils/Ids';
import { ensureContact, logInteraction } from '../../../utils/CrmUtil';
import { sequelize } from '../../../../config/sequelizeConfig';

class DonationService {
    async list(query: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        projectId?: string;
        campaignId?: string;
    }) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));

        const where: any = {};
        if (query.status) where.status = query.status;
        if (query.projectId) where.projectId = query.projectId;
        if (query.campaignId) where.campaignId = query.campaignId;
        if (query.search) {
            where[Op.or as any] = [
                { donorName: { [Op.iLike]: `%${query.search}%` } },
                { donorEmail: { [Op.iLike]: `%${query.search}%` } },
                { receiptNumber: { [Op.iLike]: `%${query.search}%` } },
            ];
        }

        const [{ rows, count }, successTotal] = await Promise.all([
            Donation.findAndCountAll({
                where,
                include: [
                    { model: Project, attributes: ['id', 'title', 'slug'] },
                    { model: Campaign, attributes: ['id', 'title', 'slug'] },
                ],
                order: [['createdAt', 'DESC']],
                limit,
                offset: (page - 1) * limit,
            }),
            Donation.sum('amount', { where: { ...where, status: 'success' } }),
        ]);
        return { data: rows, page, limit, total: count, successTotal: successTotal ?? 0 };
    }

    async get(id: string) {
        const donation = await Donation.findByPk(id, { include: [Project, Campaign] });
        if (!donation) throw new ValidationError('Donation not found', StatusCodes.NOT_FOUND);
        return donation;
    }

    /**
     * Mark a donation successful exactly once (idempotent): assigns a receipt
     * number and bumps project/campaign raised totals inside one transaction.
     */
    async settleSuccess(donationId: string): Promise<{ receiptNumber: string }> {
        return sequelize.transaction(async (t) => {
            const donation = await Donation.findByPk(donationId, {
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (!donation) throw new ValidationError('Donation not found', StatusCodes.NOT_FOUND);
            if (donation.status === 'success') {
                return { receiptNumber: donation.receiptNumber }; // idempotent replay
            }
            if (donation.status === 'refunded') {
                throw new ValidationError('Donation was refunded');
            }

            const receiptNumber = makeReceiptNumber();
            await donation.update(
                { status: 'success', receiptNumber, receiptedAt: new Date() },
                { transaction: t }
            );

            if (donation.projectId) {
                await Project.increment(
                    { raisedAmount: Number(donation.amount) },
                    { where: { id: donation.projectId }, transaction: t }
                );
            }
            if (donation.campaignId) {
                await Campaign.increment(
                    { raisedAmount: Number(donation.amount) },
                    { where: { id: donation.campaignId }, transaction: t }
                );
            }
            return { receiptNumber };
        });
    }

    /** Settle + CRM trail (used by admin confirm & the mock gateway webhook). */
    async confirm(donationId: string, actorId?: string) {
        const result = await this.settleSuccess(donationId);
        const donation = await Donation.findByPk(donationId);
        if (donation) {
            const contactId = await ensureContact({
                userId: donation.userId,
                fullName: donation.donorName,
                email: donation.donorEmail,
                phone: donation.donorPhone,
                type: 'donor',
            });
            await logInteraction({
                contactId,
                kind: 'donation',
                subject: `Donated ₹${donation.amount}${donation.isAnonymous ? ' (anonymous)' : ''}`,
                detail: `Receipt ${result.receiptNumber}`,
                createdBy: actorId ?? null,
            });
        }
        return result;
    }

    async refund(donationId: string, reason: string) {
        return sequelize.transaction(async (t) => {
            const donation = await Donation.findByPk(donationId, {
                transaction: t,
                lock: t.LOCK.UPDATE,
            });
            if (!donation) throw new ValidationError('Donation not found', StatusCodes.NOT_FOUND);
            if (donation.status !== 'success') {
                throw new ValidationError('Only successful donations can be refunded');
            }

            await donation.update({ status: 'refunded', refundReason: reason }, { transaction: t });

            if (donation.projectId) {
                await Project.decrement(
                    { raisedAmount: Number(donation.amount) },
                    { where: { id: donation.projectId }, transaction: t }
                );
            }
            if (donation.campaignId) {
                await Campaign.decrement(
                    { raisedAmount: Number(donation.amount) },
                    { where: { id: donation.campaignId }, transaction: t }
                );
            }
            return donation;
        });
    }

    async markFailed(donationId: string) {
        const donation = await Donation.findByPk(donationId);
        if (!donation) throw new ValidationError('Donation not found', StatusCodes.NOT_FOUND);
        if (donation.status === 'success') {
            throw new ValidationError('Donation already succeeded');
        }
        await donation.update({ status: 'failed' });
        return { ok: true };
    }

    // ── Campaigns ────────────────────────────────────────────────
    async listCampaigns() {
        return Campaign.findAll({
            include: [{ model: Project, attributes: ['id', 'title', 'slug'] }],
            order: [['createdAt', 'DESC']],
        });
    }

    async createCampaign(data: any) {
        const slug = slugify(data.slug || data.title);
        const existing = await Campaign.findOne({ where: { slug } });
        if (existing) throw new ValidationError(`Slug "${slug}" already used`, StatusCodes.CONFLICT);
        return Campaign.create({ ...data, slug } as any);
    }

    async updateCampaign(id: string, data: any) {
        const campaign = await Campaign.findByPk(id);
        if (!campaign) throw new ValidationError('Campaign not found', StatusCodes.NOT_FOUND);
        const patch = { ...data };
        if (data.slug) patch.slug = slugify(data.slug);
        await campaign.update(patch);
        return campaign;
    }

    async removeCampaign(id: string) {
        const campaign = await Campaign.findByPk(id);
        if (!campaign) throw new ValidationError('Campaign not found', StatusCodes.NOT_FOUND);
        await campaign.destroy(); // donations keep their rows (campaign link nulled)
        return { ok: true, title: campaign.title };
    }
}

export default new DonationService();
