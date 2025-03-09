import { Router } from "express";
import * as auth from "./auth.service.js";
import { validate } from "../../middlewares/validation.js";
import {
  confirmOTPSchema,
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  refreshTokenSchema,
  signupSchema,
} from "./auth.validation.js";
import { asyncHandler } from "../../utils/asyncHandler/asyncHandler.js";
const router = Router();

router.post("/signup", validate(signupSchema), asyncHandler(auth.signup));
router.post(
  "/confirmOTP",
  validate(confirmOTPSchema),
  asyncHandler(auth.confirmOTP)
);
router.post("/login", validate(loginSchema), asyncHandler(auth.login));
router.post(
  "/forgetPassword",
  validate(forgotPasswordSchema),
  asyncHandler(auth.forgotPassword)
);
router.patch(
  "/resetPassword",
  validate(confirmOTPSchema),
  asyncHandler(auth.confirmOTP)
);
router.post(
  "/googleLogin",
  validate(googleLoginSchema),
  asyncHandler(auth.loginWithGoogle)
);

router.get(
  "/refreshToken",
  validate(refreshTokenSchema),
  asyncHandler(auth.refreshToken)
);

export default router;
