import { messageModel } from "../../../DB/models/chat.model.js";
import { companyModel } from "../../../DB/models/company.model.js";

export function sendMessage({ socket, io }) {
  return async ({ receiverId, content }) => {
    const message = await messageModel.findOne({
      $or: [
        { senderId: socket.id, receiverId: receiverId },
        { senderId: receiverId, receiverId: socket.id },
      ],
    });
    if (!message) {
      const sender = companyModel.findOne({
        $or: [{ createdBy: socket.id }, { HRs: socket.id }],
      });
      if (!sender) {
        io.to([socket.id.toString()]).emit("error", "unauthorized");
      }
    }

    const newMessage = await messageModel.create({
      content,
      senderId: socket.id,
      receiverId
    });
    
    io.to([receiverId]).emit("message", {
      content: message.content,
      sender: socket.user.name,
    });
  };
}
