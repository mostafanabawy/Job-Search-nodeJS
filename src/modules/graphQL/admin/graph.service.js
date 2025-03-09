import { companyModel } from "../../../DB/models/company.model.js";
import { userModel } from "../../../DB/models/user.model.js";

export async function getAllUsers(parent, args) {
  const users = await userModel
    .find({
      isDeleted: false,
      isBanned: false
    }).populate([{path: "applications.jobId", select: "jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills"},
      {path: "updatedBy", select: "firstName lastName"}
    ]);
  console.log(users);
  return { message: "success", status: 200, data: { users } };
}
export async function getAllCompanies(parent, args) {
    const companies = await companyModel.find({
      isBanned: false
    })
    console.log(companies);
    return { message: "success", status: 200, data: { companies } };
}
