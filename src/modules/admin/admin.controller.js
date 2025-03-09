import { Router } from "express";
import * as admin from "./admin.service.js";
import { validate } from "../../middlewares/validation.js";
import {
  approveCompanySchema,
  banAndUnbanCompanySchema,
  banAndUnbanUserSchema,
} from "./admin.validation.js";
import { authenticate } from "../../middlewares/authentication.middleware.js";
import { roles } from "../../utils/DBConstants/constants.js";
import { asyncHandler } from "../../utils/asyncHandler/asyncHandler.js";

const router = Router();

router.patch(
  "/banAndUnbanUser/:userId",
  authenticate([roles[0]]),
  validate(banAndUnbanUserSchema),
  asyncHandler(admin.banAndUnbanUser)
);
router.patch(
  "/banAndUnbanCompany/:companyId",
  authenticate([roles[0]]),
  validate(banAndUnbanCompanySchema),
  asyncHandler(admin.banAndUnbanCompany)
);
router.patch(
  "/approveCompany/:companyId",
  authenticate([roles[0]]),
  validate(approveCompanySchema),
  asyncHandler(admin.approveCompany)
);

export default router;
