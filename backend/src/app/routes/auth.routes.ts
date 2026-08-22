import express from 'express';
import GetJwksController from '../apis/auth/controllers/get.jwks.controller';
import {
    ChangePasswordController,
    GetMeController,
    LoginController,
    RefreshTokenController,
    RegisterController,
    UpdateMeController,
} from '../apis/auth/controllers/auth.controllers';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { attachUserContext } from '../middlewares/permission.middleware';

export default (app: express.Application) => {
    // Standard OAuth 2.0 / OpenID Connect JWKS discovery endpoint.
    GetJwksController.get(app, '/.well-known/jwks.json', []);

    RegisterController.post(app, '/api/v1/auth/register', []);
    LoginController.post(app, '/api/v1/auth/login', []);
    RefreshTokenController.post(app, '/api/v1/auth/refresh', []);
    GetMeController.get(app, '/api/v1/auth/me', [authenticateJwt, attachUserContext]);
    UpdateMeController.patch(app, '/api/v1/auth/me', [authenticateJwt, attachUserContext]);
    ChangePasswordController.post(app, '/api/v1/auth/change-password', [
        authenticateJwt,
        attachUserContext,
    ]);
};
