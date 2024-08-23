import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRoutes } from "./app/modules/user/user.routes";
import { AuthRoutes } from "./app/modules/auth/auth.routes";
import { errorHandler } from "./app/middlewares/ErrorHandler";

const app = express();

// Parsers
app.use(express.json()); // JSON parser
app.use(cookieParser()); // Cookie parser

// CORS setup
app.use(
  cors({
    origin: "https://teachat-client.vercel.app", // Replace this with your frontend URL
    credentials: true, // This allows the browser to send cookies with the requests
  })
);

// Application routes:
app.use("/api/v2/user", UserRoutes); // Users
app.use("/auth", AuthRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("SERVER WORKING");
});

export default app;
