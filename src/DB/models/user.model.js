import mongoose, { Schema, Types } from "mongoose";
import {
  decisions,
  gender,
  OTP,
  providers,
  roles,
} from "../../utils/DBConstants/constants.js";
import { hashGiven } from "../../utils/hashPassword/hashPassword.js";
import { decryptVal, encryptVal } from "../../utils/encryption/encryption.js";
import cryptoJs from "crypto-js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      trim: true,
      enum: [...providers],
      default: providers[0],
    },
    gender: {
      type: String,
      trim: true,
      lowercase: true,
      enum: [...gender],
    },
    DOB: {
      type: Date,
      trim: true,
      validate: {
        validator: function (value) {
          const currentDate = new Date();
          const minDate = new Date();
          minDate.setFullYear(currentDate.getFullYear() - 18); // Calculate date 18 years ago

          // Check if the date of birth is in the past and the user is at least 18 years old
          return value < currentDate && value <= minDate;
        },
        message:
          "Date of birth must be in the past and the user must be at least 18 years old.",
      },
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: [...roles],
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
    bannedAt: {
      type: Date,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    changeCredentialTime: {
      type: Date,
      default: () => Date.now(), // 30 days
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    applications: [
      {
        jobId: {
          ref: "jobPosts",
          type: Types.ObjectId,
        },
        decision: {
          type: String,
          enum: [...decisions],
        },
      },
    ],
    resumeLink: {
      secure_url: String,
      public_id: String,
    },
    OTP: [
      {
        code: {
          type: String,
        },
        subject: {
          type: String,
          enum: [...OTP.subjects],
        },
        expiresIn: {
          type: Date,
          default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cleanup function to remove expired OTPs
export async function removeExpiredOTPs(User) {
  const now = new Date();
  await User.updateMany(
    {},
    { $pull: { OTP: { expiresIn: { $lt: now } } } } // Remove expired OTPs
  );
}

//virtual userName
userSchema.virtual("userName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (user.isModified("password")) {
      const hashedPassword = await hashGiven(user.password);
      user.password = hashedPassword;
    }
    if (user.isModified("mobileNumber")) {
      const encryptedMobileNumber = encryptVal(user.mobileNumber);
      user.mobileNumber = encryptedMobileNumber;
    }
    next();
  } catch (err) {
    console.log(err);
    return next(err);
  }
});
userSchema.post("findOne",{ document: true, query: true }, function (doc) {
  console.log("we here");
  try {
    if (doc && doc.mobileNumber) {
      doc.mobileNumber = decryptVal(doc.mobileNumber);
    }
    return;
  } catch (err) {
    console.error("Failed to decrypt mobileNumber:", err);
  }
});

export const userModel = mongoose.model("users", userSchema);
