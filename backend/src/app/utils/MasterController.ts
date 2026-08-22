import RequestBuilder, { PayloadType } from './RequestBuilder';
import { Request, RequestHandler, Response, Router } from 'express';
import asyncHandler from './AsyncHandler';
import SwaggerConfig, { ISwaggerDoc, SwaggerMethod } from '../../config/swaggerConfig';
import ResponseBuilder from './ResponseBuilder';
import { createLogger } from './Logger';

const logger = createLogger('master-controller');

interface IJoiErrors {
    query?: string[];
    param?: string[];
    body?: string[];
}

/**
 * @class MasterController
 * @description Extend this class to create a REST controller. Override
 * `restController` with the endpoint logic, `validate` with Joi rules, and
 * `doc` with swagger metadata. Register routes with the static get/post/put/
 * patch/delete helpers from a `*.routes.ts` module.
 */
class MasterController<P, Q, B> {
    static doc(): ISwaggerDoc | boolean {
        return {
            tags: [],
            summary: '',
            description: '',
        };
    }

    static validate(): RequestBuilder {
        return new RequestBuilder();
    }

    async restController(
        params: P,
        query: Q,
        body: B,
        headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        logger.debug({ params, query, body, headers, allData }, 'restController');
        return new ResponseBuilder(200, null, 'Success');
    }

    private static joiValidator(
        params: any,
        query: any,
        body: any,
        validationRules: RequestBuilder
    ): IJoiErrors | null {
        if (validationRules.get.length === 0) {
            return null;
        }

        const joiErrors: IJoiErrors = {
            query: [],
            param: [],
            body: [],
        };

        validationRules.payload.forEach((payload) => {
            if (payload.type === PayloadType.PARAMS) {
                const { error } = payload.schema.validate(params, {
                    abortEarly: false,
                    allowUnknown: true,
                });
                if (error) {
                    joiErrors.param?.push(...error.details.map((err) => err.message));
                }
            } else if (payload.type === PayloadType.QUERY) {
                const { error } = payload.schema.validate(query, {
                    abortEarly: false,
                    allowUnknown: true,
                });
                if (error) {
                    joiErrors.query?.push(...error.details.map((err) => err.message));
                }
            } else if (payload.type === PayloadType.BODY) {
                const { error } = payload.schema.validate(body, {
                    abortEarly: false,
                    allowUnknown: true,
                });
                if (error) {
                    joiErrors.body?.push(...error.details.map((err) => err.message));
                }
            }
        });

        if (joiErrors.query?.length === 0) delete joiErrors.query;
        if (joiErrors.param?.length === 0) delete joiErrors.param;
        if (joiErrors.body?.length === 0) delete joiErrors.body;

        if (Object.keys(joiErrors).length === 0) return null;

        return joiErrors;
    }

    private static handler(): RequestHandler {
        const self = this;

        return asyncHandler(async (req: Request, res: Response) => {
            const controller = new self();
            const allData = { ...req.params, ...req.query, ...req.body, ...req.headers, ...req };

            const validationRules = this.validate();
            const joiErrors = this.joiValidator(req.params, req.query, req.body, validationRules);

            if (joiErrors) {
                return res.status(400).json({
                    status: 400,
                    message: 'Validation Error',
                    data: null,
                    errors: joiErrors,
                });
            }

            const { response } = await controller.restController(
                req.params,
                req.query,
                req.body,
                req.headers,
                allData
            );

            res.status(response.status).json(response);
        });
    }

    static get(router: Router, path: string, middlewares: RequestHandler[]): Router {
        SwaggerConfig.recordApi(path, SwaggerMethod.GET, this);
        return router.get(path, ...middlewares, this.handler());
    }

    static post(router: Router, path: string, middlewares: RequestHandler[]): Router {
        SwaggerConfig.recordApi(path, SwaggerMethod.POST, this);
        return router.post(path, ...middlewares, this.handler());
    }

    static put(router: Router, path: string, middlewares: RequestHandler[]): Router {
        SwaggerConfig.recordApi(path, SwaggerMethod.PUT, this);
        return router.put(path, ...middlewares, this.handler());
    }

    static delete(router: Router, path: string, middlewares: RequestHandler[]): Router {
        SwaggerConfig.recordApi(path, SwaggerMethod.DELETE, this);
        return router.delete(path, ...middlewares, this.handler());
    }

    static patch(router: Router, path: string, middlewares: RequestHandler[]): Router {
        SwaggerConfig.recordApi(path, SwaggerMethod.PATCH, this);
        return router.patch(path, ...middlewares, this.handler());
    }
}

export default MasterController;
