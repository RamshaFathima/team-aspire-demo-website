import express from 'express';
import {
    AnalyticsController,
    DashboardController,
    DeleteSettingController,
    ListAuditLogsController,
    ListSettingsController,
    UpsertSettingController,
} from '../apis/platform/controllers/platform.controllers';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

export default (app: express.Application) => {
    DashboardController.get(app, '/api/v1/dashboard', [authenticateJwt, requirePermission('dashboard.read')]);
    AnalyticsController.get(app, '/api/v1/dashboard/analytics', [authenticateJwt, requirePermission('dashboard.read')]);
    ListAuditLogsController.get(app, '/api/v1/audit', [authenticateJwt, requirePermission('audit.read')]);
    ListSettingsController.get(app, '/api/v1/settings', [authenticateJwt, requirePermission('settings.manage')]);
    UpsertSettingController.put(app, '/api/v1/settings/:key', [authenticateJwt, requirePermission('settings.manage')]);
    DeleteSettingController.delete(app, '/api/v1/settings/:key', [authenticateJwt, requirePermission('settings.manage')]);
};
