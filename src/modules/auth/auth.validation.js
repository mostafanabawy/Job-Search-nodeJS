import joi from "joi"
import { isValidObjectId } from "../../utils/validationConstants.js/validationsConstants.js"

export const signupSchema = joi.object({
    fullName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    confirmPassword: joi.valid(joi.ref('password')).required(),
    mobileNumber: joi.string().required()
}).required()

export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
}).required()

export const confirmOTPSchema = joi.object({
    email: joi.string().email().required(), 
    otp: joi.string().required(), 
    type: joi.string().required()
}).required()

export const forgotPasswordSchema = joi.object({
    email: joi.string().email().required()
}).required()

export const googleLoginSchema = joi.object({
    idToken: joi.string().custom(isValidObjectId).required()
}).required()

export const refreshTokenSchema = joi.object({
    refreshToken: joi.string().required()
}).required()
