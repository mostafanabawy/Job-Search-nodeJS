import { userModel } from "../../DB/models/user.model.js";
import { decryptVal, encryptVal } from "../../utils/encryption/encryption.js";
import { compareHash } from "../../utils/hashPassword/hashPassword.js";
import cloudinary from "../../utils/fileUpload/cloudinary.config.js";

export async function updateUserAccount(req, res, next) {
  const { userId } = req.params;
  let { firstName, lastName, mobileNumber, DOB, gender } = req.body;
  if (userId.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to perform this action", { cause: 401 })
    );
  }

  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (DOB) user.DOB = DOB;
  if (gender) user.gender = gender;
  if (mobileNumber) user.mobile = mobileNumber;
  user.markModified("mobileNumber");
  await user.save(); // This will trigger the pre("save") middleware
  user.mobileNumber = mobileNumber;
  return res.status(200).json({ message: "success", data: user });
}

export async function getUserAccount(req, res, next) {
  const { userId } = req.params;
  let user;
  if (userId.toString() === req.user._id.toString()) {
    user = await userModel.findOne({_id: userId}).exec()
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }
  } else {
    user = await userModel
      .findOne({_id: userId})
      .select("mobileNumber userName profilePic coverPic")
      .exec();
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }
  }

  return res.status(200).json({ message: "success", data: user });
}

export async function updatePassword(req, res, next) {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;
  if (userId.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to perform this action", { cause: 401 })
    );
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const isMatch = compareHash(oldPassword, user.password);
  if (!isMatch) {
    return next(new Error("Invalid credentials", { cause: 401 }));
  }
  user.password = newPassword;
  await user.save();
  return res.status(200).json({ message: "success" });
}

export async function uploadProfilePic(req, res, next) {
  const { userId } = req.params;
  if (userId.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to perform this action", { cause: 401 })
    );
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `user/${req.user._id}`,
  });
  user.profilePic = { secure_url, public_id };
  await user.save();
  return res.status(200).json({ message: "success" });
}

export async function uploadCoverPic(req, res, next) {
  const { userId } = req.params;
  if (userId.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to perform this action", { cause: 401 })
    );
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
    folder: `user/${req.user._id}`,
  });
  user.coverPic = { secure_url, public_id };
  await user.save();
  return res.status(200).json({ message: "success" });
}

export async function deleteProfilePic(req, res, next) {
  const { userId } = req.params;
  if (userId.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to perform this action", { cause: 401 })
    );
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const results = await cloudinary.uploader.destroy(user.profilePic.public_id);
  if (results.result !== "ok") {
    return next(new Error("Failed to delete logo", { cause: 500 }));
  }
  user.profilePic = {};
  await user.save();
  return res.status(200).json({ message: "success" });
}
export async function deleteCoverPic(req, res, next) {
  const { userId } = req.params;
  if (userId.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to perform this action", { cause: 401 })
    );
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  const results = await cloudinary.uploader.destroy(user.coverPic.public_id);
  if (results.result !== "ok") {
    return next(new Error("Failed to delete logo", { cause: 500 }));
  }
  user.coverPic = {};
  await user.save();
  return res.status(200).json({ message: "success" });
}
export async function softDeleteUser(req, res, next) {
  const { userId } = req.params;
  if (userId.toString() !== req.user._id.toString()) {
    return next(
      new Error("You are not authorized to perform this action", { cause: 401 })
    );
  }
  const user = await userModel.findById(userId);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }
  user.isDeleted = true;
  await user.save();
  return res.status(200).json({ message: "success" });
}
