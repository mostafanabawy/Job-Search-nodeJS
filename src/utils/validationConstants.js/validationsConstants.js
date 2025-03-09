import { Types } from "mongoose";
import { fileTypes } from "../fileUpload/multerCloudUpload.js";
import joi from "joi"

export function isValidObjectId(value, helper) {
    return Types.ObjectId.isValid(value) ? true : helper.message("invalid object id")
}

export const validFile = {
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().valid(...fileTypes.images).required(),
    size: joi.number().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
}