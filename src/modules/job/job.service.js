import { companyModel } from "../../DB/models/company.model.js";
import { jobModel } from "../../DB/models/jobOpportunity.model.js";
import { userModel } from "../../DB/models/user.model.js";

export async function addJob(req, res, next) {
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription } =
    req.body;
  const company = await companyModel.findOne({
    $or: [{ createdBy: req.user._id }, { HRs: req.user._id }],
  });
  if (!company) {
    return next(new Error("not an HR or Owner, can't add job", { cause: 403 }));
  }

  const newJob = await jobModel.create({
    ...req.body,
    companyId: company._id,
    addedBy: req.user._id,
  });
  return res.status(200).json({ message: "success", data: { newJob } });
}

export async function updateJob(req, res, next) {
  const { jobId } = req.params;
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription } =
    req.body;
  const job = await jobModel.findOneAndUpdate(
    { _id: jobId, addedBy: req.user._id },
    { ...req.body, updatedBy: req.user._id },
    { new: true, runValidators: true }
  );
  if (!job) {
    return next(new Error("not authorized to update this job", { cause: 403 }));
  }
  return res.status(200).json({ message: "success", data: { job } });
}

export async function deleteJob(req, res, next) {
  const { jobId } = req.params;
  const job = await jobModel.findById(jobId);
  const company = await companyModel.findOne({
    //HRs: req.user._id,
    _id: job.companyId,
  });
  if (!company) {
    return next(
      new Error("not an HR of the company, can't delete job", { cause: 403 })
    );
  }
  const isAuth = company.HRs.find((hr) => hr.toString() === req.user._id.toString())
  if(!isAuth){
    return next(new Error("not authorized to delete this job", { cause: 403 }));
  }
  job.closed = true;
  await job.save();
  return res.status(200).json({ message: "success", data: { job } });
}

export async function getAllJobsForOneCompany(req, res, next) {
  const { page = 1, limit = 10, sortBy = "createdAt", search } = req.query;
  const { companyId } = req.params
  const match = {companyId};
  if (search) {
    match.companyName = { $regex: search, $options: "i" };
  }
  const count = await jobModel.countDocuments(match);
  const jobs = await jobModel
    .find(match)
    .sort({ [sortBy]: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  return res.status(200).json({ message: "success", count, data: { jobs } });
}

export async function getAllJobs(req, res, next) {
  const { page = 1, limit = 10, sortBy = "createdAt", search } = req.query;
  const match = {};
  if (search) {
    match.$or = [
      { jobTitle: { $regex: search, $options: "i" } },
      { jobLocation: { $regex: search, $options: "i" } },
      { seniorityLevel: { $regex: search, $options: "i" } },
      { technicalSkills: { $regex: search, $options: "i" } },
    ];
  }
  const count = await jobModel.countDocuments(match);
  const jobs = await jobModel
    .find(match)
    .sort({ [sortBy]: 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
  return res.status(200).json({ message: "success", count, data: { jobs } });
}

export async function getAllApplications(req, res, next) {
    const { jobId } = req.params;
    const job = await jobModel.findById(jobId).populate("applications");
    if (!job) {
      return next(new Error("job not found", { cause: 404 }));
    }
    return res.status(200).json({ message: "success", data: { applications: job.applications } });
}

/* export async function applyToJob(req, res, next) {
    const { jobId } = req.params;
    const job = await jobModel.findById(jobId);
    if (!job || job.closed) {
      return next(new Error("job not found", { cause: 404 }));
    }
    const { name, email, phoneNumber, resumeLink } = req.body;
    const application = await userModel.findOneAndUpdate(
        {_id: req.user._id},
        { $push: { applications: job._id}, resumeLink},
        {new: true, runValidators: true}
    );
    job.applications.push(application);
    await job.save();
    return res.status(200).json({ message: "success", data: { application } });
} */

export async function respondToApplicant(req, res, next) {
    const { decision } = req.body;
    const { applicationId } = req.params;
    const application = await userModel.findOneAndUpdate(
        {_id: req.user._id, "applications._id": applicationId},
        { $set: { "applications.decision": decision } },
        { new: true, runValidators: true }
    );
    if (!application) {
        return next(new Error("not authorized to respond to this application", { cause: 403 }));
    }
    return res.status(200).json({ message: "success", data: { application } });   
}