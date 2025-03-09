import { Router } from "express";
import * as user from "./user.service.js";
import { authenticate } from "../../middlewares/authentication.middleware.js";
import { roles } from "../../utils/DBConstants/constants.js";
import {
  fileTypes,
  uploadCloud,
} from "../../utils/fileUpload/multerCloudUpload.js";
import {asyncHandler} from "../../utils/asyncHandler/asyncHandler.js"
import { validate } from "../../middlewares/validation.js";
import { deleteCoverPicSchema, deleteProfilePicSchema, getAnyProfileSchema, getOwnedProfileSchema, softDeleteUserSchema, updatePasswordSchema, updateUserAccountSchema, uploadCoverPicSchema, uploadProfilePicSchema } from "./user.validation.js";

const router = Router();

router.patch(
  "/:userId", 
  authenticate([...roles]),
  validate(updateUserAccountSchema), 
  asyncHandler(user.updateUserAccount)
);
router.get(
  "/getOwnedProfile/:userId", 
  authenticate([...roles]),
  validate(getOwnedProfileSchema), 
  asyncHandler(user.getUserAccount)
);
router.get(
  "/getAnyProfile/:userId", 
  authenticate([...roles]),
  validate(getAnyProfileSchema), 
  asyncHandler(user.getUserAccount)
);
router.patch(
  "/updatePassword/:userId",
  authenticate([...roles]),
  validate(updatePasswordSchema),  
  asyncHandler(user.updatePassword)
);
router.patch(
  "/uploadProfilePic/:userId",
  authenticate([...roles]),
  uploadCloud(fileTypes.images).single("profilePic"),
  validate(uploadProfilePicSchema),
  asyncHandler(user.uploadProfilePic)
);
router.patch(
  "/uploadCoverPic/:userId",
  authenticate([...roles]),
  uploadCloud(fileTypes.images).single("coverPic"),
  validate(uploadCoverPicSchema),
  asyncHandler(user.uploadCoverPic)
);
router.patch(
  "/deleteProfilePic/:userId",
  authenticate([...roles]),
  validate(deleteProfilePicSchema),
  asyncHandler(user.deleteProfilePic)
);
router.patch(
  "/deleteCoverPic/:userId",
  authenticate([...roles]),
  validate(deleteCoverPicSchema),
  asyncHandler(user.deleteCoverPic)
);
router.patch(
  "/softDelete/:userId",
  authenticate([...roles]),
  validate(softDeleteUserSchema),
  asyncHandler(user.softDeleteUser)
);

export default router;
