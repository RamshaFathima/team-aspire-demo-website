import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import crmService from '../services/crm.service';
import { audit } from '../../../utils/AuditUtil';

type IdParams = { id: string };

const contactBodySchema = {
    fullName: Joi.string().min(2).max(120),
    email: Joi.string().email().allow(null),
    phone: Joi.string().max(20).allow(null, ''),
    type: Joi.string().valid('donor', 'volunteer', 'student', 'teacher', 'partner', 'other'),
    tags: Joi.array().items(Joi.string().max(40)),
    notes: Joi.string().max(2000).allow(null, ''),
};

export class ListContactsController extends MasterController<null, any, null> {
    static doc() {
        return { tags: ['CRM'], summary: 'List contacts', description: 'Paginated contact directory' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                page: Joi.number().integer().min(1).optional(),
                limit: Joi.number().integer().min(1).max(100).optional(),
                search: Joi.string().max(120).optional(),
                type: Joi.string()
                    .valid('donor', 'volunteer', 'student', 'teacher', 'partner', 'other')
                    .optional(),
            })
        );
        return payload;
    }

    async restController(_params: null, query: any): Promise<ResponseBuilder> {
        const result = await crmService.listContacts(query);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class GetContact360Controller extends MasterController<IdParams, null, null> {
    static doc() {
        return { tags: ['CRM'], summary: 'Person 360', description: 'Contact + donations + courses + certificates + timeline' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        return payload;
    }

    async restController(params: IdParams): Promise<ResponseBuilder> {
        const person = await crmService.person360(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, person, 'OK');
    }
}

export class CreateContactController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['CRM'], summary: 'Create contact', description: 'Manually add a contact' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({ ...contactBodySchema, fullName: contactBodySchema.fullName.required() })
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
        const contact = await crmService.createContact(body);
        audit(allData, { action: 'contact.create', resourceType: 'contact', resourceId: contact.id });
        return new ResponseBuilder(StatusCodes.CREATED, contact, 'Contact created');
    }
}

export class UpdateContactController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['CRM'], summary: 'Update contact', description: 'Edit contact fields/tags/notes' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(Joi.object().keys(contactBodySchema));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const contact = await crmService.updateContact(params.id, body);
        audit(allData, { action: 'contact.update', resourceType: 'contact', resourceId: params.id });
        return new ResponseBuilder(StatusCodes.SUCCESS, contact, 'Contact updated');
    }
}

export class AddInteractionController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['CRM'], summary: 'Log interaction', description: 'Add a timeline entry to a contact' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
        payload.addToBody(
            Joi.object().keys({
                kind: Joi.string()
                    .valid('note', 'email', 'call', 'meeting', 'donation', 'enrollment', 'event', 'form')
                    .required(),
                subject: Joi.string().min(2).max(200).required(),
                detail: Joi.string().max(2000).allow(null, '').optional(),
                occurredAt: Joi.date().optional(),
            })
        );
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const interaction = await crmService.addInteraction(params.id, body, allData.userCtx.id);
        return new ResponseBuilder(StatusCodes.CREATED, interaction, 'Interaction logged');
    }
}
