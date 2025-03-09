import joi from "joi";
import { isValidObjectId } from "../../utils/validationConstants.js/validationsConstants.js";

export const addJobSchema = joi
  .object({
    jobTitle: joi.string().required(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO").required(),
    jobDescription: joi.string().required(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string())
  })
  .required();

  export const updateJobSchema = joi
  .object({
    jobId: joi.string().custom(isValidObjectId).required(),
    jobTitle: joi.string(),
    jobLocation: joi.string().valid("onsite", "remotely", "hybrid"),
    workingTime: joi.string().valid("part-time", "full-time"),
    seniorityLevel: joi.string().valid("fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"),
    jobDescription: joi.string(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string())
  })
  .required();

  export const deleteJobSchema = joi.object({
    jobId: joi.string().custom(isValidObjectId).required()
  }).required()

  export const getAllJobsForOneCompanySchema = joi.object({
    page: joi.string().required(),
    limit: joi.string().required(),
    sortBy: joi.string().required(),
    search: joi.string().required(),
    companyId: joi.string().custom(isValidObjectId).required()
  }).required()

  export const getAllJobsSchema = joi.object({
    page: joi.string().required(),
    limit: joi.string().required(),
    sortBy: joi.string().required(),
    search: joi.string().required()
  })

  export const getAllApplicationsSchema = joi.object({
    jobId: joi.string().custom(isValidObjectId).required()
  }).required()

  export const respondToApplicantSchema = joi.object({
    decision: joi.string().required(),
    applicationId: joi.string().custom(isValidObjectId).required()
  }).required()
