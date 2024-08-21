import express from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.routes";
import { AuthRoutes } from "./app/modules/auth/auth.routes";
import { errorHandler } from "./app/middlewares/ErrorHandler";

const app = express();

// Parsers
app.use(express.json()); // JSON parse will happen
app.use(cors());

// Application routes:
// app.use('/api/v1/task', TaskRoutes); //Task
app.use("/api/v2/user", UserRoutes); //Users
// app.use('/user', AuthRoutes);       //Login
app.use("/auth", AuthRoutes);
app.use(errorHandler);
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
          }
          .container {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✔ Tea Chat Server Running Successfully  🦍</h1>
        </div>
      </body>
    </html>
  `);
});

export default app;
