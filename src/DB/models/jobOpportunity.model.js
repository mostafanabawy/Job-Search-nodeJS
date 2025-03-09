import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: ["onsite", "remotely", "hybrid"],
      required: true,
    },
    workingTime: {
      type: String,
      enum: ["part-time", "full-time"],
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: ["fresh", "Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
      minlength: 50,
      maxlength: 2000,
    },
    technicalSkills: {
      type: [String],
    },
    softSkills: {
      type: [String],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // HR who created the job
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // HR who last updated the job
    },
    closed: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

jobSchema.virtual("applications", {
  ref: "users",
  localField: "_id",
  foreignField: "applications",
  justOne: false,
});

export const jobModel = mongoose.model("jobPosts", jobSchema);
