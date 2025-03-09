import mongoose, { Types } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    receiverId: {
      type: Types.ObjectId,
      ref: "users",
      required: true
    },
    senderId: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const messageModel = mongoose.model("messages", messageSchema);
