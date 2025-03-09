import { userModel } from "../DB/models/user.model.js";
import { tokenVerify } from "../utils/tokenHandler/tokenHandler.js";

export function authenticate(allowed) {
  return async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const role = req.headers.authorization?.split(" ")[0];
    if (!allowed.includes(role)) {
      return next(
        new Error("You are not authorized to perform this action", {
          cause: 401,
        })
      );
    }
    const secret =
      role === "admin"
        ? process.env.ADMIN_TOKEN_ACCESS_SECRET
        : process.env.USER_TOKEN_ACCESS_SECRET;
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    try {
      const payload = tokenVerify(token, secret);
      const user = await userModel.findOne({ email: payload.email });
      if (Number(payload.iat) * 1000 < user.changeCredentialTime.getTime()) {
        return next(new Error("invalid token, please login again"));
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    } catch (error) {
      return next(error);
    }
  };
}
