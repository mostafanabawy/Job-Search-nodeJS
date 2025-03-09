import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    industry: {
      type: String,
    },
    address: {
      type: String,
    },
    numberOfEmployees: {
      type: String,
      min: 11,
      max: 30,
    },
    companyEmail: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    logo: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    coverPic: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    bannedAt: {
      type: Date,
      default: null,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    legalAttachment: {
      secure_url: { type: String },
      public_id: { type: String },
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CompanySchema.virtual("relatedJobs", {
  ref: "jobPosts",
  localField: "_id",
  foreignField: "companyId",
});

export const companyModel = mongoose.model("companies", CompanySchema);
