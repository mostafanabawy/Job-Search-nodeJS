import joi from "joi"

export const banAndUnbanUserSchema = joi.object({
    userId: joi.string().required(),
})
export const banAndUnbanCompanySchema = joi.object({
    companyId: joi.string().required()
})
export const approveCompanySchema = joi.object({
    companyId: joi.string().required()
})