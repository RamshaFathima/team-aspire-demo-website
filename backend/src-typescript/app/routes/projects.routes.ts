import express from 'express';
import {
    AddProjectUpdateController,
    CreateProjectController,
    DeleteProjectUpdateController,
    GetProjectController,
    ListProjectsController,
    SetProjectStatusController,
    UpdateProjectController,
} from '../apis/projects/controllers/project.controllers';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

export default (app: express.Application) => {
    ListProjectsController.get(app, '/api/v1/projects', [authenticateJwt, requirePermission('projects.read')]);
    GetProjectController.get(app, '/api/v1/projects/:id', [authenticateJwt, requirePermission('projects.read')]);
    CreateProjectController.post(app, '/api/v1/projects', [authenticateJwt, requirePermission('projects.manage')]);
    UpdateProjectController.patch(app, '/api/v1/projects/:id', [authenticateJwt, requirePermission('projects.manage')]);
    SetProjectStatusController.post(app, '/api/v1/projects/:id/status', [authenticateJwt, requirePermission('projects.publish')]);
    AddProjectUpdateController.post(app, '/api/v1/projects/:id/updates', [authenticateJwt, requirePermission('projects.manage')]);
    DeleteProjectUpdateController.delete(app, '/api/v1/projects/:id/updates/:updateId', [authenticateJwt, requirePermission('projects.manage')]);
};
