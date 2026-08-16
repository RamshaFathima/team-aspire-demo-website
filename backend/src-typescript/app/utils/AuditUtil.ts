import AuditLog from '../models/audit.log.model';
import { createLogger } from './Logger';

const log = createLogger('audit');

type AuditInput = {
    action: string;
    resourceType: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
};

/**
 * Fire-and-forget audit trail write; failures are logged, never thrown.
 * `allData` is the controller's allData (contains userCtx, ip, headers from req spread).
 */
export const audit = (allData: any, input: AuditInput): void => {
    const actor = allData?.userCtx ?? null;
    AuditLog.create({
        actorId: actor?.id ?? null,
        actorEmail: actor?.email ?? null,
        action: input.action,
        resourceType: input.resourceType,
        resourceId: input.resourceId ?? null,
        ip: allData?.ip ?? null,
        userAgent: allData?.['user-agent'] ?? null,
        metadata: input.metadata ?? {},
    } as any).catch((err) => log.error({ err }, 'audit write failed'));
};
