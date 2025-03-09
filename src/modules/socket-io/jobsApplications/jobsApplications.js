import { companyModel } from "../../../DB/models/company.model.js";
import { jobModel } from "../../../DB/models/jobOpportunity.model.js";
import { userModel } from "../../../DB/models/user.model.js";

export function applyToJob(parent, args) {
  return async (jobId) => {
    const job = await jobModel.findById(jobId);
    if (!job) {
      io.to([socket.id.toString()]).emit("error", "Job not found");
    }
    const user = await userModel.findByIdAndUpdate(
      socket.id,
      { $push: { applications: { jobId: job._id, decision: null } } },
      { new: true, runValidators: true }
    );
    const company = await companyModel.findById(job.companyId);
    let usersToNotify = company.HRs.map(user => user.toString());
    socket.to([...usersToNotify]).emit("newApplicant", { applicant: user });
  };
}
