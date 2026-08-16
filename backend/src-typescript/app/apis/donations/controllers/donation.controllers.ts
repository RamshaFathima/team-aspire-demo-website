import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import donationService from '../services/donation.service';
import { audit } from '../../../utils/AuditUtil';

type IdParams = { id: string };

const idPath = () => {
    const payload = new RequestBuilder();
    payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
    return payload;
};

export class ListDonationsController extends MasterController<null, any, null> {
    static doc() {
        return { tags: ['Donations'], summary: 'List donations', description: 'Paginated, filterable' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToQuery(
            Joi.object().keys({
                page: Joi.number().integer().min(1).optional(),
                limit: Joi.number().integer().min(1).max(100).optional(),
                search: Joi.string().max(120).optional(),
                status: Joi.string()
                    .valid('initiated', 'pending', 'success', 'failed', 'refunded')
                    .optional(),
                projectId: Joi.string().uuid().optional(),
                campaignId: Joi.string().uuid().optional(),
            })
        );
        return payload;
    }

    async restController(_params: null, query: any): Promise<ResponseBuilder> {
        const result = await donationService.list(query);
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'OK');
    }
}

export class GetDonationController extends MasterController<IdParams, null, null> {
    static doc() {
        return { tags: ['Donations'], summary: 'Get donation', description: 'Full donation detail' };
    }

    public static validate(): RequestBuilder {
        return idPath();
    }

    async restController(params: IdParams): Promise<ResponseBuilder> {
        const donation = await donationService.get(params.id);
        return new ResponseBuilder(StatusCodes.SUCCESS, donation, 'OK');
    }
}

export class ConfirmDonationController extends MasterController<IdParams, null, null> {
    static doc() {
        return {
            tags: ['Donations'],
            summary: 'Confirm donation',
            description: 'Finance confirms e.g. a verified bank transfer (idempotent)',
        };
    }

    public static validate(): RequestBuilder {
        return idPath();
    }

    async restController(
        params: IdParams,
        _query: null,
        _body: null,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const result = await donationService.confirm(params.id, allData.userCtx.id);
        audit(allData, { action: 'donation.confirm', resourceType: 'donation', resourceId: params.id });
        return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Donation confirmed');
    }
}

export class RefundDonationController extends MasterController<IdParams, null, { reason: string }> {
    static doc() {
        return { tags: ['Donations'], summary: 'Refund donation', description: 'Refund + rollback totals' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(Joi.object().keys({ reason: Joi.string().min(3).max(300).required() }));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: { reason: string },
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const donation = await donationService.refund(params.id, body.reason);
        audit(allData, {
            action: 'donation.refund',
            resourceType: 'donation',
            resourceId: params.id,
            metadata: { amount: donation.amount, reason: body.reason },
        });
        return new ResponseBuilder(StatusCodes.SUCCESS, { ok: true }, 'Donation refunded');
    }
}

const campaignBodySchema = {
    title: Joi.string().min(3).max(160),
    slug: Joi.string().max(160),
    description: Joi.string().allow(null, ''),
    projectId: Joi.string().uuid().allow(null),
    goalAmount: Joi.number().positive().allow(null),
    status: Joi.string().valid('active', 'completed', 'archived'),
    startsAt: Joi.date().allow(null),
    endsAt: Joi.date().allow(null),
};

export class ListCampaignsController extends MasterController<null, null, null> {
    static doc() {
        return { tags: ['Campaigns'], summary: 'List campaigns', description: 'All campaigns' };
    }

    async restController(): Promise<ResponseBuilder> {
        const campaigns = await donationService.listCampaigns();
        return new ResponseBuilder(StatusCodes.SUCCESS, campaigns, 'OK');
    }
}

export class CreateCampaignController extends MasterController<null, null, any> {
    static doc() {
        return { tags: ['Campaigns'], summary: 'Create campaign', description: 'New fundraising campaign' };
    }

    public static validate(): RequestBuilder {
        const payload = new RequestBuilder();
        payload.addToBody(
            Joi.object().keys({ ...campaignBodySchema, title: campaignBodySchema.title.required() })
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
        const campaign = await donationService.createCampaign(body);
        audit(allData, { action: 'campaign.create', resourceType: 'campaign', resourceId: campaign.id });
        return new ResponseBuilder(StatusCodes.CREATED, campaign, 'Campaign created');
    }
}

export class UpdateCampaignController extends MasterController<IdParams, null, any> {
    static doc() {
        return { tags: ['Campaigns'], summary: 'Update campaign', description: 'Edit campaign fields' };
    }

    public static validate(): RequestBuilder {
        const payload = idPath();
        payload.addToBody(Joi.object().keys(campaignBodySchema));
        return payload;
    }

    async restController(
        params: IdParams,
        _query: null,
        body: any,
        _headers: any,
        allData: any
    ): Promise<ResponseBuilder> {
        const campaign = await donationService.updateCampaign(params.id, body);
        audit(allData, { action: 'campaign.update', resourceType: 'campaign', resourceId: params.id });
        return new ResponseBuilder(StatusCodes.SUCCESS, campaign, 'Campaign updated');
    }
}
