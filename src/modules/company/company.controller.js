import { Router } from "express";
import * as company from "./company.service.js";
import { authenticate } from "../../middlewares/authentication.middleware.js";
import { roles } from "../../utils/DBConstants/constants.js";
import jobRouter from "../job/job.controller.js"
import { asyncHandler } from "../../utils/asyncHandler/asyncHandler.js";
import { fileTypes, uploadCloud } from "../../utils/fileUpload/multerCloudUpload.js";
import { validate } from "../../middlewares/validation.js";
import { addCompanySchema, deleteCompanyCoverSchema, deleteCompanyLogoSchema, searchByNameSchema, searchByRelatedJobSchema, softDeleteCompanySchema, updateCompanySchema, uploadCompanyCoverSchema, uploadCompanyLogoSchema } from "./company.validation.js";
const router = Router();

router.use("/:companyId/jobs", jobRouter)
router.post(
  "/addCompany", 
  authenticate([...roles]),
  validate(addCompanySchema), 
  asyncHandler(company.addCompany)
);
router.patch(
  "/updateCompanyData/:companyId",
  authenticate([...roles]),
  validate(updateCompanySchema),
  asyncHandler(company.updateCompanyData)
);
router.patch(
  "/softDeleteCompany/:companyId",
  authenticate([...roles]),
  validate(softDeleteCompanySchema),
  asyncHandler(company.softDeleteCompany)
);
router.get(
  "/searchByRelatedJobs/:companyId",
  authenticate([...roles]),
  validate(searchByRelatedJobSchema),
  asyncHandler(company.searchByRelatedJobs)
);
router.get(
  "/searchByName/:companyId",
  authenticate([...roles]),
  validate(searchByNameSchema),
  asyncHandler(company.searchByName)
);
router.patch(
  "/uploadCompanyLogo/:companyId",
  authenticate([...roles]),
  uploadCloud(fileTypes.images).single("logo"),
  validate(uploadCompanyLogoSchema),
  asyncHandler(company.uploadCompanyLogo)
);
router.patch(
  "/uploadCompanyCover/:companyId",
  authenticate([...roles]),
  uploadCloud(fileTypes.images).single("cover"),
  validate(uploadCompanyCoverSchema),
  asyncHandler(company.uploadCompanyCover)
);
router.patch(
  "/deleteCompanyLogo/:companyId",
  authenticate([...roles]),
  validate(deleteCompanyLogoSchema),
  asyncHandler(company.deleteCompanyLogo)
);
router.patch(
  "/deleteCompanyCover/:companyId",
  authenticate([...roles]),
  validate(deleteCompanyCoverSchema),
  asyncHandler(company.deleteCompanyCover)
);

export default router;
