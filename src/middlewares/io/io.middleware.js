import { userModel } from "../../DB/models/user.model.js"; 
import { tokenVerify } from "../../utils/tokenHandler/tokenHandler.js";

export async function authenticate(socket, next) {
  const token = socket.handshake.query.token;
  if (!token) {
    return next(new Error("Token is required", { cause: 401 }));
  }
  try {
    const { id } = tokenVerify(token);
    const user = await userModel.findById(id);
    if (!user) {
      return next(new Error("Unauthorized", { cause: 401 }));
    }
    socket.user = user;
    socket.id = user.id;
    console.log("auth successful");
    next();
  } catch (error) {
    return next(error);
  }
}
