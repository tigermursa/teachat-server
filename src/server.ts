import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import http from "http";
import { Server } from "socket.io";
import initializeSocket from "./app/socket/socket";

// Ensure the port is a number
const port = parseInt(config.port as string, 10) || 5000;

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
        origin: "*", 
        methods: ["GET", "POST"],
      },
    });

    // Initialize socket connections
    initializeSocket(io);

    // Start the server with the correct port type
    server.listen(port, '0.0.0.0', () => {
      console.log(`Server running at port ${port} ✨`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

// Start the server
startServer().catch((err) => console.error("Unexpected error:", err));
