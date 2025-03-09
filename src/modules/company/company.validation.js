import joi from "joi";
import { isValidObjectId, validFile } from "../../utils/validationConstants.js/validationsConstants.js";

export const addCompanySchema = joi
  .object({
    companyName: joi.string().required(),
    description: joi.string().min(5).max(1000).required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    companyEmail: joi.string().email().required(),
  })
  .required();
export const updateCompanySchema = joi
  .object({
    companyName: joi.string().required(),
    description: joi.string().min(5).max(1000).required(),
    industry: joi.string().required(),
    address: joi.string().required(),
    companyEmail: joi.string().email().required(),
  })
  .required();

  export const softDeleteCompanySchema = joi.object({
    companyId: joi.string().custom(isValidObjectId).required()
  }).required()

  export const searchByRelatedJobSchema = joi.object({
    companyId: joi.string().custom(isValidObjectId).required()
  }).required()

  export const searchByNameSchema = joi.object({
    query: joi.string().required()
  }).required()

  export const uploadCompanyLogoSchema = joi.object({
    companyId: joi.string().custom(isValidObjectId).required(),
    file: joi.object(validFile).required()
  }).required()

  export const uploadCompanyCoverSchema = joi.object({
    companyId: joi.string().custom(isValidObjectId).required(),
    file: joi.object(validFile).required()
  }).required()

  export const deleteCompanyLogoSchema = joi.object({
    companyId: joi.string().custom(isValidObjectId).required()
  }).required()
  export const deleteCompanyCoverSchema = joi.object({
    companyId: joi.string().custom(isValidObjectId).required()
  }).required()
