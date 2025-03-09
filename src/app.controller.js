import cors from "cors";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js"
import companyRouter from "./modules/company/company.controller.js"
import jobRouter from "./modules/job/job.controller.js"
import adminRouter from "./modules/admin/admin.controller.js"
import { connectDB } from "./DB/connection.js";
import { graphSchema } from "./modules/app.graph.js";
import { createHandler } from "graphql-http/lib/use/express";
import { Server } from "socket.io";
import { runSocket} from "./modules/socket-io/socket.controller.js"
import "./utils/cronJobs/cronJobs.js";
export async function bootstrap(app, express) {
  await connectDB();
  app.use(cors());
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/admin", adminRouter);
  app.use("/company", companyRouter);
  app.use("/job", jobRouter);
  app.use("/graphql", createHandler({ schema: graphSchema }));
  app.all("*", (req, res, next) => {
    next(new Error("incorrect Route", { cause: 404 }));
  });
  const port = process.env.PORT
  const server = app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
  );
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  await runSocket(io);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.cause || 500).json({ message: err.message });
  });
}
