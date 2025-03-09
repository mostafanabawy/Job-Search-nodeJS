import joi from "joi"
import { isValidObjectId, validFile } from "../../utils/validationConstants.js/validationsConstants.js"

export const updateUserAccountSchema = joi.object({
    firstName: joi.string().min(3).max(50),
    lastName: joi.string().min(3).max(50),
    mobileNumber: joi.string().min(10).max(15),
    DOB: joi.string(),
    gender: joi.string().valid("Male", "Female")
}).required()

export const getOwnedProfileSchema = joi.object({
    userId: joi.string().custom(isValidObjectId).required()
}).required()

export const getAnyProfileSchema = joi.object({
    userId: joi.string().custom(isValidObjectId).required()
}).required()

export const updatePasswordSchema = joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required().min(8),
    confirmPassword: joi.string().required().valid(joi.ref("newPassword"))
})

export const uploadProfilePicSchema = joi.object({
    file: joi.object(validFile),
    userId: joi.string().custom(isValidObjectId).required()
}).required()
export const uploadCoverPicSchema = joi.object({
    file: joi.object(validFile),
    userId: joi.string().custom(isValidObjectId).required()
}).required()

export const deleteProfilePicSchema = joi.object({
    userId: joi.string().custom(isValidObjectId).required()
}).required()
export const deleteCoverPicSchema = joi.object({
    userId: joi.string().custom(isValidObjectId).required()
}).required()

export const softDeleteUserSchema = joi.object({
    userId: joi.string().custom(isValidObjectId).required()
}).required()