import { authenticate } from "../../middlewares/io/io.middleware.js"
import { sendMessage } from "./chat/chat.service.js";
import { applyToJob } from "./jobsApplications/jobsApplications.js";

export async function runSocket(io){
    io.use(authenticate);
    io.on("connection", (socket) => {
        socket.on("message", sendMessage({socket, io}))
        socket.on("jobApp", applyToJob({socket, io}))
    });

}