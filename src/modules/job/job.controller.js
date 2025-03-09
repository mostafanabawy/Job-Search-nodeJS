import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler/asyncHandler.js";
import { authenticate } from "../../middlewares/authentication.middleware.js";
import { roles } from "../../utils/DBConstants/constants.js";
import * as job from "./job.service.js";
import { validate } from "../../middlewares/validation.js";
import { addJobSchema, deleteJobSchema, getAllApplicationsSchema, getAllJobsForOneCompanySchema, getAllJobsSchema, respondToApplicantSchema, updateJobSchema } from "./job.validation.js";
const router = Router({ mergeParams: true });

router.post(
  "/addJob",
  authenticate([...roles]),
  validate(addJobSchema),
  asyncHandler(job.addJob)
);
router.patch(
  "/updateJob/:jobId",
  authenticate([...roles]),
  validate(updateJobSchema),
  asyncHandler(job.updateJob)
);
router.patch(
  "/deleteJob/:jobId",
  authenticate([...roles]),
  validate(deleteJobSchema),
  asyncHandler(job.deleteJob)
);
router.get(
  "/",
  authenticate([...roles]),
  asyncHandler(job.getAllJobsForOneCompany)
);
router.get(
    "/all", 
    authenticate([...roles]),
    validate(getAllJobsSchema), 
    asyncHandler(job.getAllJobs)
);
router.get(
  "/jobs",
  authenticate([...roles]),
  validate(getAllJobsForOneCompanySchema),
  asyncHandler(job.getAllJobsForOneCompany)
);
router.get(
  "/:jobId/jobApplications",
  authenticate([...roles]),
  validate(getAllApplicationsSchema),
  asyncHandler(job.getAllApplications)
);
router.post(
  "/respondToApp/:applicationId",
  authenticate([...roles]),
  validate(respondToApplicantSchema),
  asyncHandler(job.respondToApplicant)
);
// 7. is missing
export default router;
