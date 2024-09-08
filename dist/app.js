"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = require("./app/modules/user/user.routes");
const auth_routes_1 = require("./app/modules/auth/auth.routes");
const ErrorHandler_1 = require("./app/errors/ErrorHandler");
const users_routes_1 = require("./app/modules/Chat/User/users.routes");
const messages_routes_1 = require("./app/modules/Chat/Messages/messages.routes");
const conversation_routes_1 = require("./app/modules/Chat/Conversation/conversation.routes");
const thought_routes_1 = require("./app/modules/thought/thought.routes");
const friend_routes_1 = require("./app/modules/friend/friend.routes");
const app = (0, express_1.default)();
// Parserss
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// CORS setup
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
// Application routes:
app.use("/api/v2/user", user_routes_1.UserRoutes); // Users
app.use("/auth", auth_routes_1.AuthRoutes);
app.use("/api", users_routes_1.UserExcRoute);
app.use("/api", messages_routes_1.MassageRoute);
app.use("/api", conversation_routes_1.ConversationRoute);
app.use("/api/thought", thought_routes_1.ThoughtRoutes);
app.use("/api", friend_routes_1.FriendRoutes);
app.use(ErrorHandler_1.errorHandler);
app.get("/", (req, res) => {
    res.send("SERVER WORKING");
});
exports.default = app;
