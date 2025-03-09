import { jobModel } from "../../DB/models/jobOpportunity.model.js";
import { companyModel } from "../../DB/models/company.model.js";
import cloudinary from "../../utils/fileUpload/cloudinary.config.js";
export async function addCompany(req, res, next) {
  const company = await companyModel.create({
    ...req.body,
    createdBy: req.user._id,
  });
  return res.status(201).json({ message: "success", data: { company } });
}

export async function updateCompanyData(req, res, next) {
    const { companyId } = req.params;
    const company = await companyModel.findByIdAndUpdate(
        {_id: companyId, createdBy: req.user._id},
        { ...req.body, updatedAt: new Date()},
        { new: true, runValidators: true });
    if (!company) {
        return next(new Error("Company not found or not owner", { cause: 404 }));
    }
    return res.status(200).json({ message: "success", data: {company} });
}

export async function softDeleteCompany(req, res, next) {
    const { companyId } = req.params;
    const company = await companyModel.findById(companyId);
    if (!company) {
        return next(new Error("Company not found or not owner", { cause: 404 }));
    }
    if (company.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return next(new Error("You are not authorized to perform this action", { cause: 401 }));
    }
    company.isDeleted = true;
    await company.save();
    return res.status(200).json({ message: "success", data: {company} });
}

export async function searchByRelatedJobs(req, res, next) {
    const { companyId } = req.params;
    const company = await companyModel.findOne({_id: companyId}).populate("relatedJobs");
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }
    return res.status(200).json({ message: "success", data: { jobsRelated : company.relatedJobs } });
}

export async function searchByName(req, res, next) {
    const { query } = req.query;
    const companies = await companyModel.find({
        companyName: { $regex: query, $options: "i" },
        isDeleted: false,
        isBanned: false
    });
    if (!companies.length) {
        return next(new Error( "No companies found", {cause: 404}) );
    }
    return res.status(200).json({ message: "success", data: { companies } });
}

export async function uploadCompanyLogo(req, res, next) {
    const { companyId } = req.params;
    const company = await companyModel.findById(companyId);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }
    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to perform this action", { cause: 401 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {folder: `user/${req.user._id}/company`});
    company.logo = { secure_url, public_id };
    await company.save();
    return res.status(200).json({ message: "success" });
}

export async function uploadCompanyCover(req, res, next) {
    const { companyId } = req.params;
    const company = await companyModel.findById(companyId);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }
    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to perform this action", { cause: 401 }));
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {folder: `user/${req.user._id}/company`});
    company.coverPic = { secure_url, public_id };
    await company.save();
    return res.status(200).json({ message: "success" });
}

export async function deleteCompanyLogo(req, res, next) {
    const { companyId } = req.params;
    const company = await companyModel.findById(companyId);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }
    if (company.createdBy.toString()!== req.user._id.toString()) {
        return next(new Error("You are not authorized to perform this action", { cause: 401 }));
    }
    const results = await cloudinary.uploader.destroy(company.logo.public_id);
    if (results.result !== "ok") {
        return next(new Error("Failed to delete logo", { cause: 500 }));
    }
    company.logo = {};
    await company.save();
    return res.status(200).json({ message: "success" });
}

export async function deleteCompanyCover(req, res, next) {
    const { companyId } = req.params;
    const company = await companyModel.findById(companyId);
    if (!company) {
        return next(new Error("Company not found", { cause: 404 }));
    }
    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error("You are not authorized to perform this action", { cause: 401 }));
    }
    const results = await cloudinary.uploader.destroy(company.coverPic.public_id);
    if (results.result !== "ok") {
        return next(new Error("Failed to delete cover", { cause: 500 }));
    }
    company.coverPic = {};
    await company.save();
    return res.status(200).json({ message: "success" });
}
