import { customAlphabet } from "nanoid";
import { userModel } from "../../DB/models/user.model.js";
import { emailEmitter } from "../../utils/sendEmail/emailEvent.js";
import { emails } from "../../utils/sendEmail/sendEmail.js";
import jwt from "jsonwebtoken";
import {
  compareHash,
  hashGiven,
} from "../../utils/hashPassword/hashPassword.js";
import { OTP, roles } from "../../utils/DBConstants/constants.js";
import {
  tokenSign,
  tokenVerify,
} from "../../utils/tokenHandler/tokenHandler.js";
import { verifyGoogleToken } from "../../utils/googleAuth/googleAuth.js";

export async function signup(req, res, next) {
  const { fullName, email, password, mobileNumber } = req.body;
  const names = fullName.split(" ");
  let user = await userModel.findOne({ email: email });
  if (user) {
    return next(new Error("email already exists", { cause: 403 }));
  }
  const nanoid = customAlphabet("0123456789", 6);
  const otp = nanoid();
  const hashedOTP = await hashGiven(otp);
  user = await userModel.create({
    firstName: names[0],
    lastName: names[names.length - 1],
    email,
    password,
    mobileNumber,
    provider: "system",
    OTP: [{ code: hashedOTP, subject: "confirmEmail" }],
  });
  emailEmitter.emit("OTPAndSendEmail", {
    otp,
    email,
    role: "user",
    name: fullName,
    emails: emails.confirmEmail,
  });
  return res.status(201).json({ message: "success", data: user });
}

export async function confirmOTP(req, res, next) {
  const { email, otp, type } = req.body;
  const user = await userModel.findOne({ email: email }); // get user
  if (!user) {
    return next(new Error("email not found", { cause: 404 }));
  }
  let i;
  const otpObj = user.OTP.find((otpObj, index) => {
    i = index;
    return otpObj.subject === type;
  }); // get otp object
  if (!otpObj) {
    return next(new Error("OTP not found", { cause: 404 }));
  }
  if (otpObj.expiresIn < new Date()) {
    // check expiration
    return next(new Error("OTP expired", { cause: 403 }));
  }
  const isMatched = compareHash(otp, otpObj.code); // compare otp
  if (!isMatched) {
    return next(new Error("invalid OTP", { cause: 403 }));
  }
  if (type === "confirmEmail") {
    await userModel // remove OTP from user and update confirm field
      .updateOne(
        { email: email },
        { $pull: { OTP: { subject: OTP.subjects[0] } }, isConfirmed: true }
      );
  } else if (type === OTP.subjects[1]) {
    user.OTP.splice(i, 1);
    user.password = req.body.newPassword;
    await user.save();
  }
  return res.status(200).json({ message: "success" });
}

export async function login(req, res, next) {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return next(new Error("incorrect email or password", { cause: 404 }));
  }
  if (user.isDeleted) {
    user.isDeleted = false;
    user.save();
  }
  if (!user.isConfirmed) {
    return next(new Error("email not confirmed", { cause: 403 }));
  }
  const isMatched = compareHash(password, user.password);
  if (!isMatched) {
    return next(new Error("incorrect email or password", { cause: 403 }));
  }
  //access and refresh tokens
  const accessToken = tokenSign(
    { email },
    "1h",
    user.role === roles[0]
      ? process.env.ADMIN_TOKEN_ACCESS_SECRET
      : process.env.USER_TOKEN_ACCESS_SECRET
  );
  const refreshToken = tokenSign(
    { email },
    "7d",
    user.role === roles[0]
      ? process.env.ADMIN_TOKEN_REFRESH_SECRET
      : process.env.USER_TOKEN_REFRESH_SECRET
  );
  return res
    .status(200)
    .json({ message: "success", data: { accessToken, refreshToken } });
}
export async function loginWithGoogle(req, res, next) {
  const { idToken } = req.body;
  const payload = await verifyGoogleToken(idToken);
  if (!payload) {
    return next(new Error("Invalid Google token", { cause: 404 }));
  }
  console.log(payload);
  const { name, email } = payload;
  const names = name.split(" ");
  let user = await userModel.findOne({ email: email });
  if (!user) {
    user = await userModel.create({
      firstName: names[0],
      lastName: names[names.length - 1],
      email,
      isConfirmed: true,
      provider: "google",
    });
  }
  const token = tokenSign(
    { email },
    "30m",
    user.role === "admin"
      ? process.env.ADMIN_TOKEN_ACCESS_SECRET
      : process.env.USER_TOKEN_ACCESS_SECRET
  );
  const refreshToken = tokenSign(
    { email },
    "7d",
    user.role === "admin"
      ? process.env.ADMIN_TOKEN_REFRESH_SECRET
      : process.env.USER_TOKEN_REFRESH_SECRET
  );
  return res
    .status(200)
    .json({
      status: "success",
      data: { accessToken: token, refreshToken: refreshToken },
    });
}

export async function forgotPassword(req, res, next) {
  const { email } = req.body;
  const user = await userModel.findOne({ email: email });
  if (!user) {
    return next(new Error("email not found", { cause: 404 }));
  }
  const nanoid = customAlphabet("0123456789", 6);
  const otp = nanoid();
  const hashedOTP = await hashGiven(otp);
  await userModel.updateOne(
    { email: email },
    { $push: { OTP: { code: hashedOTP, subject: OTP.subjects[1] } } }
  );
  emailEmitter.emit("OTPAndSendEmail", {
    otp,
    email,
    name: user.userName,
    emails: emails.resetPassword,
  });
  return res.status(200).json({ message: "success" });
}
export async function refreshToken(req, res, next) {
  const { refreshToken } = req.body;
  const decoded = jwt.decode(refreshToken); // ⚠️ No verification yet
  if (!decoded || !decoded.email)
    return res.status(403).json({ message: "Invalid token" });
  let user = await userModel.findOne({ email: decoded.email });
  const secretKey =
    user.role === "admin"
      ? process.env.ADMIN_TOKEN_REFRESH_SECRET
      : process.env.USER_TOKEN_REFRESH_SECRET;

  const payload = tokenVerify(refreshToken, secretKey);
  if (!payload) {
    return next(new Error("Invalid refresh token", { cause: 401 }));
  }

  if (!user || payload.iat < user.changeCredentialTime) {
    return next(new Error("Invalid refresh token", { cause: 401 }));
  }
  user.changeCredentialTime = Math.floor(Date.now() / 1000);
  await user.save();

  const accessToken = tokenSign(
    { email: payload.email },
    "30m",
    user.role === "admin"
      ? process.env.ADMIN_TOKEN_ACCESS_SECRET
      : process.env.USER_TOKEN_ACCESS_SECRET
  );
  const newRefreshToken = tokenSign(
    { email: payload.email },
    "7d",
    user.role === "admin"
      ? process.env.ADMIN_TOKEN_REFRESH_SECRET
      : process.env.USER_TOKEN_REFRESH_SECRET
  );

  return res.status(200).json({
    status: "success",
    data: { accessToken, refreshToken: newRefreshToken },
  });
}
