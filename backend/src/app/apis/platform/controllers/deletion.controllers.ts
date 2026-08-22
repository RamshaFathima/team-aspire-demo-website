import Joi from 'joi';
import MasterController from '../../../utils/MasterController';
import RequestBuilder from '../../../utils/RequestBuilder';
import ResponseBuilder from '../../../utils/ResponseBuilder';
import { StatusCodes } from '../../../enums/StatusCodes';
import { audit } from '../../../utils/AuditUtil';
import projectService from '../../projects/services/project.service';
import donationService from '../../donations/services/donation.service';
import lmsService from '../../lms/services/lms.service';
import crmService from '../../crm/services/crm.service';
import cmsService from '../../cms/services/cms.service';
import userService from '../../users/services/user.service';

type IdParams = { id: string };

/** Factory for uniform, audited DELETE endpoints in MasterController style. */
function deletionController(options: {
    tag: string;
    summary: string;
    action: string;
    resourceType: string;
    run: (id: string, allData: any) => Promise<unknown>;
}) {
    return class DeletionController extends MasterController<IdParams, null, null> {
        static doc() {
            return { tags: [options.tag], summary: options.summary, description: `${options.summary} (irreversible)` };
        }

        public static validate(): RequestBuilder {
            const payload = new RequestBuilder();
            payload.addToPath(Joi.object().keys({ id: Joi.string().uuid().required() }));
            return payload;
        }

        async restController(
            params: IdParams,
            _query: null,
            _body: null,
            _headers: any,
            allData: any
        ): Promise<ResponseBuilder> {
            const result = await options.run(params.id, allData);
            audit(allData, { action: options.action, resourceType: options.resourceType, resourceId: params.id, metadata: result as Record<string, unknown> });
            return new ResponseBuilder(StatusCodes.SUCCESS, result, 'Deleted');
        }
    };
}

export const DeleteProjectController = deletionController({
    tag: 'Projects',
    summary: 'Delete project',
    action: 'project.delete',
    resourceType: 'project',
    run: (id) => projectService.remove(id),
});

export const DeleteCampaignController = deletionController({
    tag: 'Campaigns',
    summary: 'Delete campaign',
    action: 'campaign.delete',
    resourceType: 'campaign',
    run: (id) => donationService.removeCampaign(id),
});

export const DeleteCourseController = deletionController({
    tag: 'LMS',
    summary: 'Delete course',
    action: 'course.delete',
    resourceType: 'course',
    run: (id) => lmsService.removeCourse(id),
});

export const DeleteCohortController = deletionController({
    tag: 'LMS',
    summary: 'Delete cohort',
    action: 'cohort.delete',
    resourceType: 'cohort',
    run: (id) => lmsService.removeCohort(id),
});

export const DeleteSessionController = deletionController({
    tag: 'LMS',
    summary: 'Delete class session',
    action: 'session.delete',
    resourceType: 'class_session',
    run: (id, allData) => lmsService.removeSession(allData.userCtx, id),
});

export const DeleteContactController = deletionController({
    tag: 'CRM',
    summary: 'Delete contact',
    action: 'contact.delete',
    resourceType: 'contact',
    run: (id) => crmService.removeContact(id),
});

export const DeletePageController = deletionController({
    tag: 'CMS',
    summary: 'Delete page',
    action: 'page.delete',
    resourceType: 'page',
    run: (id) => cmsService.removePage(id),
});

export const DeleteUserController = deletionController({
    tag: 'Users',
    summary: 'Delete user account',
    action: 'user.delete',
    resourceType: 'user',
    run: (id, allData) => userService.remove(id, allData.userCtx.id),
});
