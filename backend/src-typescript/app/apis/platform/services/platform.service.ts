import { Op } from 'sequelize';
import AuditLog from '../../../models/audit.log.model';
import Setting from '../../../models/setting.model';
import { cacheClient } from '../../../common/redis.client';

const PUBLIC_SETTINGS_KEY = 'aspire:settings:public';

class PlatformService {
    async listAuditLogs(query: {
        page?: number;
        limit?: number;
        action?: string;
        resourceType?: string;
        actorEmail?: string;
    }) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(200, Math.max(1, Number(query.limit) || 50));
        const where: any = {};
        if (query.action) where.action = { [Op.iLike]: `%${query.action}%` };
        if (query.resourceType) where.resourceType = query.resourceType;
        if (query.actorEmail) where.actorEmail = { [Op.iLike]: `%${query.actorEmail}%` };

        const { rows, count } = await AuditLog.findAndCountAll({
            where,
            order: [['createdAt', 'DESC']],
            limit,
            offset: (page - 1) * limit,
        });
        return { data: rows, page, limit, total: count };
    }

    async listSettings() {
        return Setting.findAll({ order: [['key', 'ASC']] });
    }

    async upsertSetting(key: string, value: unknown, description: string | undefined, updatedBy: string) {
        const [setting] = await Setting.upsert({
            key,
            value: value as object,
            description: description ?? null,
            updatedBy,
        } as any);
        await cacheClient.del(PUBLIC_SETTINGS_KEY).catch(() => undefined);
        return setting;
    }

    async deleteSetting(key: string) {
        await Setting.destroy({ where: { key } });
        await cacheClient.del(PUBLIC_SETTINGS_KEY).catch(() => undefined);
        return { ok: true };
    }

    /** Public slice of settings (site.*, features.*, donations.*), cached briefly. */
    async publicSettings(): Promise<Record<string, unknown>> {
        try {
            const cached = await cacheClient.get(PUBLIC_SETTINGS_KEY);
            if (cached) return JSON.parse(cached);
        } catch {
            // cache unavailable — fall through to DB
        }
        const rows = await Setting.findAll();
        const map: Record<string, unknown> = {};
        for (const row of rows) {
            if (
                row.key.startsWith('site.') ||
                row.key.startsWith('features.') ||
                row.key.startsWith('donations.')
            ) {
                map[row.key] = row.value;
            }
        }
        cacheClient.setex(PUBLIC_SETTINGS_KEY, 120, JSON.stringify(map)).catch(() => undefined);
        return map;
    }
}

export default new PlatformService();
