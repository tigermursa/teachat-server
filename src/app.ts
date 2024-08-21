import express from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.routes";
import { AuthRoutes } from "./app/modules/auth/auth.routes";
import { errorHandler } from "./app/middlewares/ErrorHandler";

const app = express();

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions)); // Apply CORS middleware

// Parsers
app.use(express.json()); // JSON parse will happen

// Application routes:
app.use("/api/v2/user", UserRoutes); // Users
app.use("/auth", AuthRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send(`SERVER WORKING`);
});

export default app;
