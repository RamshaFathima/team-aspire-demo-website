import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import authService from '../services/auth.service';
import { audit } from '../../../utils/AuditUtil';
import {
    IChangePasswordBody,
    ILoginBody,
    IRefreshBody,
    IRegisterBody,
    IUpdateMeBody,
} from '../interfaces';

export class RegisterController extends MasterController<null, null, IRegisterBody> {
    static doc() {
        return { tags: ['Auth'], summary: 'Register', description: 'Create a member account' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                fullName: Joi.string().min(2).max(120).required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(8).max(100).required(),
                phone: Joi.string().min(7).max(20).optional(),
            })
        );
        return payload;
    }

    async restController(
        _params: null,
        _query: null,
        body: IRegisterBody
    ): Promise<ResponseBuilder> {
        const result = await authService.register(body);
        return new ResponseBuilder(StatusCodes.CREATED, result, 'Account created successfully');
    }
}

export class LoginController extends MasterController<null, null, ILoginBody> {
    static doc() {
        return { tags: ['Auth'], summary: 'Login', description: 'Login with email and password' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            })
        );
        return payload;
    }

    async restController(_params: null, _query: null, body: ILoginBody): Promise<ResponseBuilder> {
        const result = await authService.login(body);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Logged in successfully');
    }
}

export class RefreshTokenController extends MasterController<null, null, IRefreshBody> {
    static doc() {
        return { tags: ['Auth'], summary: 'Refresh tokens', description: 'Exchange a refresh token' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(Joi.object().keys({ refreshToken: Joi.string().required() }));
        return payload;
    }

    async restController(_params: null, _query: null, body: IRefreshBody): Promise<ResponseBuilder> {
        const tokens = await authService.refresh(body.refreshToken);
        return new ResponseBuilder(StatusCodes.SUCCESS, tokens, 'Tokens refreshed');
    }
}

export class GetMeController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Auth'], summary: 'Current user', description: 'Profile of the logged-in user' };
    }

    async restController(
        _params: null,
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const me = await authService.me(allData.userCtx.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, me, 'OK');
    }
}

export class UpdateMeController extends MasterController<null, null, IUpdateMeBody> {
    static doc() {
        return { tags: ['Auth'], summary: 'Update profile', description: 'Update own name/phone' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                fullName: Joi.string().min(2).max(120).optional(),
                phone: Joi.string().min(7).max(20).allow(null).optional(),
                signatureUrl: Joi.string().dataUri().max(400_000).allow(null).optional(),
            })
        );
        return payload;
    }

    async restController(
        _params: null,
        _query: null,
        body: IUpdateMeBody,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const me = await authService.updateMe(allData.userCtx.id, body);
        audit(allData, { action: 'user.self_update', resourceType: 'user', resourceId: allData.userCtx.id });
        return new ResponseBuilder(StatusCodes.SUCCESS, me, 'Profile updated');
    }
}

export class ChangePasswordController extends MasterController<null, null, IChangePasswordBody> {
    static doc() {
        return { tags: ['Auth'], summary: 'Change password', description: 'Change own password' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({
                currentPassword: Joi.string().required(),
                newPassword: Joi.string().min(8).max(100).required(),
            })
        );
        return payload;
    }

    async restController(
        _params: null,
        _query: null,
        body: IChangePasswordBody,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await authService.changePassword(allData.userCtx.id, body);
        audit(allData, { action: 'user.password_change', resourceType: 'user', resourceId: allData.userCtx.id });
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Password changed');
    }
}
