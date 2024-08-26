import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRoutes } from "./app/modules/user/user.routes";
import { AuthRoutes } from "./app/modules/auth/auth.routes";
import { errorHandler } from "./app/middlewares/ErrorHandler";
import { UserExcRoute } from "./app/modules/Conversation/users.routes";
import { MassageRoute } from "./app/modules/Conversation/messages.routes";
import { ConversationRoute } from "./app/modules/Conversation/conversation.routes";

const app = express();

// Parsers
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Application routes:
app.use("/api/v2/user", UserRoutes); // Users
app.use("/auth", AuthRoutes);
app.use("/api", UserExcRoute);
app.use("/api", MassageRoute);
app.use("/api", ConversationRoute);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("SERVER WORKING");
});

export default app;
