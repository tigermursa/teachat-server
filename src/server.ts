import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import http from "http";
import { Server } from "socket.io";
import initializeSocket from "./app/socket/socket";

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.data_base_url as string);
    console.log("Mongoose connected successfully! 🥫");

    // Create an HTTP server
    const server = http.createServer(app);

    // Initialize Socket.io
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    // Initialize socket connections
    initializeSocket(io);

    // Start the server
    server.listen(config.port, () => {
      console.log(`Server running at port ${config.port} ✨`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

// Start the server
startServer().catch((err) => console.error("Unexpected error:", err));
