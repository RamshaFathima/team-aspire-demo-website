import express from 'express';
import {
    ConfirmPublicDonationController,
    FailPublicDonationController,
    InitiateDonationController,
    PublicCampaignsController,
    PublicCourseDetailController,
    PublicCoursesController,
    PublicDonationStatusController,
    PublicPageController,
    PublicProjectDetailController,
    PublicProjectsController,
    PublicSettingsController,
    PublicStatsController,
    PublicUpcomingSessionsController,
    SubmitFormController,
    VerifyCertificateController,
} from '../apis/public/controllers/public.controllers';
import {
    MarkNotificationsReadController,
    MyCertificatesController,
    MyDonationsController,
    MyEnrollmentsController,
    MyNotificationsController,
    MyUpcomingSessionsController,
    SelfEnrollController,
} from '../apis/member/controllers/member.controllers';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { attachUserContext } from '../middlewares/permission.middleware';

export default (app: express.Application) => {
    // ── Public (no auth) ─────────────────────────────────────────
    PublicSettingsController.get(app, '/api/v1/public/settings', []);
    PublicProjectsController.get(app, '/api/v1/public/projects', []);
    PublicProjectDetailController.get(app, '/api/v1/public/projects/:slug', []);
    PublicCampaignsController.get(app, '/api/v1/public/campaigns', []);
    PublicCoursesController.get(app, '/api/v1/public/courses', []);
    PublicCourseDetailController.get(app, '/api/v1/public/courses/:slug', []);
    PublicPageController.get(app, '/api/v1/public/pages/:slug', []);
    PublicStatsController.get(app, '/api/v1/public/stats', []);
    PublicUpcomingSessionsController.get(app, '/api/v1/public/sessions/upcoming', []);

    InitiateDonationController.post(app, '/api/v1/public/donations', []);
    ConfirmPublicDonationController.post(app, '/api/v1/public/donations/:id/confirm', []);
    FailPublicDonationController.post(app, '/api/v1/public/donations/:id/fail', []);
    PublicDonationStatusController.get(app, '/api/v1/public/donations/:id', []);

    VerifyCertificateController.get(app, '/api/v1/public/certificates/verify/:code', []);
    SubmitFormController.post(app, '/api/v1/public/forms/:kind', []);

    // ── Member self-service (auth, no special permission) ───────
    const member = [authenticateJwt, attachUserContext];
    MyDonationsController.get(app, '/api/v1/me/donations', member);
    MyEnrollmentsController.get(app, '/api/v1/me/enrollments', member);
    MyUpcomingSessionsController.get(app, '/api/v1/me/sessions/upcoming', member);
    MyCertificatesController.get(app, '/api/v1/me/certificates', member);
    MyNotificationsController.get(app, '/api/v1/me/notifications', member);
    MarkNotificationsReadController.post(app, '/api/v1/me/notifications/read', member);
    SelfEnrollController.post(app, '/api/v1/me/enroll', member);
};
