import { companyModel } from "../../DB/models/company.model.js"
import { userModel } from "../../DB/models/user.model.js"


export async function banAndUnbanUser(req, res, next) {
    const { userId } = req.params
    const user = await userModel.findById(userId)
    if (!user) {
        return next(new Error("User not found", { cause: 404 }))
    }
    user.isBanned = !user.isBanned
    user.bannedAt = user.isBanned? Date.now() : ""
    await user.save()
    return res.status(200).json({ message: `User ${user.userName} has been ${user.isBanned? "banned" : "unbanned"}` })
}
export async function banAndUnbanCompany(req, res, next) {
    const { companyId } = req.params
    const company = await companyModel.findById(companyId)
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }))
    }
    company.isBanned = !company.isBanned
    company.bannedAt = company.isBanned? Date.now(): ""
    await company.save()
    return res.status(200).json({ message: `Company ${company.companyName} has been ${company.isBanned? "banned" : "unbanned"}` })   
}

export async function approveCompany(req, res, next) {
    const { companyId } = req.params
    const company = await companyModel.findById(companyId)
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }))
    }
    company.approvedByAdmin = true
    await company.save()
    return res.status(200).json({ message: `Company ${company.companyName} has been approved` })   
}