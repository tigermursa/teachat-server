"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./app/config"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./app/socket/socket"));
// Ensure the port is a number
const port = parseInt(config_1.default.port, 10) || 5000;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield mongoose_1.default.connect(config_1.default.data_base_url);
            console.log("Mongoose connected successfully! 🥫");
            // Create an HTTP server
            const server = http_1.default.createServer(app_1.default);
            // Initialize Socket.io
            const io = new socket_io_1.Server(server, {
                cors: {
                    origin: "*",
                    methods: ["GET", "POST"],
                },
            });
            // Initialize socket connections
            (0, socket_1.default)(io);
            // Start the server with the correct port type
            server.listen(port, "0.0.0.0", () => {
                console.log(`Server running at port ${port} ✨`);
            });
        }
        catch (error) {
            console.error("Error starting the server:", error);
        }
    });
}
// Start the server
startServer().catch((err) => console.error("Unexpected error:", err));
