import express from 'express';
import {
    ConfirmDonationController,
    CreateCampaignController,
    GetDonationController,
    ListCampaignsController,
    ListDonationsController,
    RefundDonationController,
    UpdateCampaignController,
} from '../apis/donations/controllers/donation.controllers';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

export default (app: express.Application) => {
    // Campaign paths are registered before /:id so "campaigns" isn't captured as an id.
    ListCampaignsController.get(app, '/api/v1/donations/campaigns/list', [authenticateJwt, requirePermission('donations.read')]);
    CreateCampaignController.post(app, '/api/v1/donations/campaigns', [authenticateJwt, requirePermission('campaigns.manage')]);
    UpdateCampaignController.patch(app, '/api/v1/donations/campaigns/:id', [authenticateJwt, requirePermission('campaigns.manage')]);

    ListDonationsController.get(app, '/api/v1/donations', [authenticateJwt, requirePermission('donations.read')]);
    GetDonationController.get(app, '/api/v1/donations/:id', [authenticateJwt, requirePermission('donations.read')]);
    ConfirmDonationController.post(app, '/api/v1/donations/:id/confirm', [authenticateJwt, requirePermission('donations.manage')]);
    RefundDonationController.post(app, '/api/v1/donations/:id/refund', [authenticateJwt, requirePermission('donations.refund')]);
};
