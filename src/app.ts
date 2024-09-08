import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRoutes } from "./app/modules/user/user.routes";
import { AuthRoutes } from "./app/modules/auth/auth.routes";
import { errorHandler } from "./app/errors/ErrorHandler";
import { UserExcRoute } from "./app/modules/Chat/User/users.routes";
import { MassageRoute } from "./app/modules/Chat/Messages/messages.routes";
import { ConversationRoute } from "./app/modules/Chat/Conversation/conversation.routes";
import { ThoughtRoutes } from "./app/modules/thought/thought.routes";
import { FriendRoutes } from "./app/modules/friend/friend.routes";

const app = express();

// Parserss
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(
  cors({
    origin: "https://teachatproclient.onrender.com",
    credentials: true,
  })
);

// Application routes:
app.use("/api/v2/user", UserRoutes); // Users
app.use("/auth", AuthRoutes);
app.use("/api", UserExcRoute);
app.use("/api", MassageRoute);
app.use("/api", ConversationRoute);
app.use("/api/thought", ThoughtRoutes);
app.use("/api", FriendRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("SERVER WORKING");
});

export default app;
