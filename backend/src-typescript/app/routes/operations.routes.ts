import express from 'express';
import {
    CertificateEligibilityController,
    IssueCertificateController,
    ListCertificatesController,
    RevokeCertificateController,
} from '../apis/certificates/controllers/certificate.controllers';
import {
    CreatePageController,
    GetPageController,
    ListPagesController,
    PublishPageController,
    UpdatePageController,
} from '../apis/cms/controllers/cms.controllers';
import {
    AddInteractionController,
    CreateContactController,
    GetContact360Controller,
    ListContactsController,
    UpdateContactController,
} from '../apis/crm/controllers/crm.controllers';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

export default (app: express.Application) => {
    const auth = authenticateJwt;

    // Certificates
    ListCertificatesController.get(app, '/api/v1/certificates', [auth, requirePermission('certificates.read')]);
    IssueCertificateController.post(app, '/api/v1/certificates', [auth, requirePermission('certificates.issue')]);
    RevokeCertificateController.post(app, '/api/v1/certificates/:id/revoke', [auth, requirePermission('certificates.revoke')]);
    CertificateEligibilityController.get(app, '/api/v1/certificates/eligibility/:cohortId', [auth, requirePermission('certificates.issue')]);

    // CMS
    ListPagesController.get(app, '/api/v1/cms/pages', [auth, requirePermission('cms.manage')]);
    GetPageController.get(app, '/api/v1/cms/pages/:id', [auth, requirePermission('cms.manage')]);
    CreatePageController.post(app, '/api/v1/cms/pages', [auth, requirePermission('cms.manage')]);
    UpdatePageController.patch(app, '/api/v1/cms/pages/:id', [auth, requirePermission('cms.manage')]);
    PublishPageController.post(app, '/api/v1/cms/pages/:id/publish', [auth, requirePermission('cms.manage')]);

    // CRM
    ListContactsController.get(app, '/api/v1/crm/contacts', [auth, requirePermission('crm.read')]);
    GetContact360Controller.get(app, '/api/v1/crm/contacts/:id', [auth, requirePermission('crm.read')]);
    CreateContactController.post(app, '/api/v1/crm/contacts', [auth, requirePermission('crm.manage')]);
    UpdateContactController.patch(app, '/api/v1/crm/contacts/:id', [auth, requirePermission('crm.manage')]);
    AddInteractionController.post(app, '/api/v1/crm/contacts/:id/interactions', [auth, requirePermission('crm.manage')]);
};
