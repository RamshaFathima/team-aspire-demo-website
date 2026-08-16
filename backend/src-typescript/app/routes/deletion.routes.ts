import express from 'express';
import {
    DeleteCampaignController,
    DeleteCohortController,
    DeleteContactController,
    DeleteCourseController,
    DeletePageController,
    DeleteProjectController,
    DeleteSessionController,
    DeleteUserController,
} from '../apis/platform/controllers/deletion.controllers';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

export default (app: express.Application) => {
    const auth = authenticateJwt;

    DeleteProjectController.delete(app, '/api/v1/projects/:id', [auth, requirePermission('projects.manage')]);
    DeleteCampaignController.delete(app, '/api/v1/donations/campaigns/:id', [auth, requirePermission('campaigns.manage')]);
    DeleteCourseController.delete(app, '/api/v1/lms/courses/:id', [auth, requirePermission('lms.courses.manage')]);
    DeleteCohortController.delete(app, '/api/v1/lms/cohorts/:id', [auth, requirePermission('lms.cohorts.manage')]);
    DeleteSessionController.delete(app, '/api/v1/lms/sessions/:id', [auth, requirePermission('lms.attendance.manage')]);
    DeleteContactController.delete(app, '/api/v1/crm/contacts/:id', [auth, requirePermission('crm.manage')]);
    DeletePageController.delete(app, '/api/v1/cms/pages/:id', [auth, requirePermission('cms.manage')]);
    DeleteUserController.delete(app, '/api/v1/users/:id', [auth, requirePermission('users.delete')]);
};
