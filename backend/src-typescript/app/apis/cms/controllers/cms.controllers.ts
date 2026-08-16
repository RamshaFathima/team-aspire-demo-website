import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import cmsService from '../services/cms.service';
import { audit } from '../../../utils/AuditUtil';

type IdParams = { id: string };

const blockSchema = Joi.object().keys({
    type: Joi.string().valid('hero', 'richText', 'stats', 'cta', 'faq').required(),
    heading: Joi.string().optional(),
    subheading: Joi.string().allow('').optional(),
    body: Joi.string().allow('').optional(),
    ctaLabel: Joi.string().allow('').optional(),
    ctaHref: Joi.string().allow('').optional(),
    image: Joi.string().allow('').optional(),
    items: Joi.array().optional(),
});

const pageBodySchema = {
    title: Joi.string().min(2).max(160),
    slug: Joi.string().min(1).max(160),
    blocks: Joi.array().items(blockSchema),
    seo: Joi.object().keys({
        title: Joi.string().allow('').optional(),
        description: Joi.string().allow('').optional(),
    }),
};

export class ListPagesController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['CMS'], summary: 'List pages', description: 'All CMS pages' };
    }

    async restController(): Promise<ResponseBuilder> {
        const pages = await cmsService.listPages();
        return new ResponseBuilder(StatusCodes.SUCCESS, pages, 'OK');
    }
}

export class GetPageController extends MasterController<IdParams, null, null> {
    static doc() {
        return { tags: ['CMS'], summary: 'Get page', description: 'Page with blocks' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        return payload;
    }

    async restController(params: IdParams): Promise<ResponseBuilder> {
        const page = await cmsService.getPage(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, page, 'OK');
    }
}

export class CreatePageController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['CMS'], summary: 'Create page', description: 'New block-based page' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({ ...pageBodySchema, title: pageBodySchema.title.required() })
        );
        return payload;
    }

    async restController(
        _params: null,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const page = await cmsService.createPage(body, allData.userCtx.id);
        audit(allData, { action: 'page.create', resourceType: 'page', resourceId: page.id });
        return new ResponseBuilder(StatusCodes.CREATED, page, 'Page created');
    }
}

export class UpdatePageController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['CMS'], summary: 'Update page', description: 'Edit title/slug/blocks/SEO' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(Joi.object().keys(pageBodySchema));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const page = await cmsService.updatePage(params.id, body, allData.userCtx.id);
        audit(allData, { action: 'page.update', resourceType: 'page', resourceId: params.id });
        return new ResponseBuilder(StatusCodes.SUCCESS, page, 'Page updated');
    }
}

export class PublishPageController extends MasterController<IdParams, null, { publish: boolean }> {
    static doc() {
        return { tags: ['CMS'], summary: 'Publish page', description: 'Publish or unpublish' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(Joi.object().keys({ publish: Joi.boolean().required() }));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: { publish: boolean },
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const page = await cmsService.setPublish(params.id, body.publish, allData.userCtx.id);
        audit(allData, {
            action: body.publish ? 'page.publish' : 'page.unpublish',
            resourceType: 'page',
            resourceId: params.id,
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, page, body.publish ? 'Page published' : 'Page unpublished');
    }
}
