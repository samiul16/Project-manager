import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import teamRoutes from "./routes/teamRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import authRoutes from "./routes/authRoutes";
import { authenticateUser } from "./middlewares/authMiddleware";
import orgUserRoutes from "./routes/orgUserRoutes";
import { inboundService } from "./services/webhook/inboundService";
import { handleInboundMessage } from "./middlewares/vonageMiddleware";

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("This is home route");
});

app.use("/auth", authRoutes);

app.use("/inbound", handleInboundMessage, inboundService);

app.use(authenticateUser);

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
app.use("/employees", employeeRoutes);
app.use("/organization-users", orgUserRoutes);

const port = Number(process.env.PORT) || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});

export default app;
