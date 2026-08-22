import express from 'express';
import {
    AddCourseModuleController,
    AddLessonController,
    AssignTeacherController,
    CreateCohortController,
    CreateCourseController,
    CreateSessionController,
    DeleteModuleController,
    EnrollStudentController,
    GetAttendanceController,
    GetCohortController,
    GetCourseController,
    ListCohortsController,
    ListCoursesController,
    ListSessionsController,
    MarkAttendanceController,
    SetCourseStatusController,
    UpdateCohortController,
    UpdateCourseController,
    UpdateEnrollmentController,
    UpdateSessionController,
} from '../apis/lms/controllers/lms.controllers';
import { authenticateJwt } from '../middlewares/auth.middleware';
import { requirePermission } from '../middlewares/permission.middleware';

export default (app: express.Application) => {
    const auth = authenticateJwt;

    // Courses
    ListCoursesController.get(app, '/api/v1/lms/courses', [auth, requirePermission('lms.courses.read')]);
    GetCourseController.get(app, '/api/v1/lms/courses/:id', [auth, requirePermission('lms.courses.read')]);
    CreateCourseController.post(app, '/api/v1/lms/courses', [auth, requirePermission('lms.courses.manage')]);
    UpdateCourseController.patch(app, '/api/v1/lms/courses/:id', [auth, requirePermission('lms.courses.manage')]);
    SetCourseStatusController.post(app, '/api/v1/lms/courses/:id/status', [auth, requirePermission('lms.courses.manage')]);
    AddCourseModuleController.post(app, '/api/v1/lms/courses/:id/modules', [auth, requirePermission('lms.courses.manage')]);
    AddLessonController.post(app, '/api/v1/lms/modules/:moduleId/lessons', [auth, requirePermission('lms.courses.manage')]);
    DeleteModuleController.delete(app, '/api/v1/lms/modules/:moduleId', [auth, requirePermission('lms.courses.manage')]);

    // Cohorts
    ListCohortsController.get(app, '/api/v1/lms/cohorts', [auth, requirePermission('lms.courses.read')]);
    GetCohortController.get(app, '/api/v1/lms/cohorts/:id', [auth, requirePermission('lms.courses.read')]);
    CreateCohortController.post(app, '/api/v1/lms/cohorts', [auth, requirePermission('lms.cohorts.manage')]);
    UpdateCohortController.patch(app, '/api/v1/lms/cohorts/:id', [auth, requirePermission('lms.cohorts.manage')]);
    AssignTeacherController.post(app, '/api/v1/lms/cohorts/:id/teachers', [auth, requirePermission('lms.cohorts.manage')]);

    // Enrollments
    EnrollStudentController.post(app, '/api/v1/lms/cohorts/:id/enrollments', [auth, requirePermission('lms.enrollments.manage')]);
    UpdateEnrollmentController.patch(app, '/api/v1/lms/enrollments/:id', [auth, requirePermission('lms.enrollments.manage')]);

    // Sessions & attendance
    ListSessionsController.get(app, '/api/v1/lms/sessions', [auth, requirePermission('lms.attendance.read')]);
    CreateSessionController.post(app, '/api/v1/lms/sessions', [auth, requirePermission('lms.cohorts.manage')]);
    UpdateSessionController.patch(app, '/api/v1/lms/sessions/:id', [auth, requirePermission('lms.attendance.manage')]);
    GetAttendanceController.get(app, '/api/v1/lms/sessions/:id/attendance', [auth, requirePermission('lms.attendance.read')]);
    MarkAttendanceController.put(app, '/api/v1/lms/sessions/:id/attendance', [auth, requirePermission('lms.attendance.manage')]);
};
