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
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../modules/user/user.model");
// Users array to store connected users
let users = [];
// Helper function to find a user by userId
const findUserById = (userId) => users.find((user) => user.userId === userId);
// Helper function to broadcast updated users list
const broadcastUsersList = (io) => {
    io.emit("getUsers", users);
};
// Initialize Socket.io
const initializeSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("😉 User connected!", socket.id);
        // Add a new user to the users array
        socket.on("addUser", (userId) => {
            if (!findUserById(userId)) {
                users.push({ userId, socketId: socket.id });
                broadcastUsersList(io);
            }
        });
        // Handle sending messages between users
        socket.on("sendMessage", (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId, message, conversationId, }) {
            try {
                const receiver = findUserById(receiverId);
                const sender = findUserById(senderId);
                if (!sender) {
                    console.error(`Sender with ID ${senderId} not found.`);
                    return;
                }
                const user = yield user_model_1.User.findById(senderId).select("username email");
                if (!user) {
                    console.error(`User with ID ${senderId} not found in database.`);
                    return;
                }
                const messageData = {
                    senderId,
                    message,
                    conversationId,
                    receiverId,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                    },
                };
                if (receiver) {
                    io.to(receiver.socketId).emit("getMessage", messageData);
                }
                io.to(sender.socketId).emit("getMessage", messageData);
            }
            catch (error) {
                console.error("Error sending message:", error);
            }
        }));
        //res
        socket.on("sendFriendRequest", (_a) => __awaiter(void 0, [_a], void 0, function* ({ senderId, receiverId }) {
            try {
                const receiver = findUserById(receiverId);
                const sender = yield user_model_1.User.findById(senderId).select("username");
                if (!sender) {
                    console.error(`Sender with ID ${senderId} not found in database.`);
                    return;
                }
                if (receiver) {
                    // Emit the friend request event to the receiver
                    io.to(receiver.socketId).emit("friendRequest", {
                        senderId,
                        senderUsername: sender.username,
                    });
                    console.log(`😇 Friend request sent from ${sender.username} to user ${receiverId}`);
                }
                else {
                    console.error(`Receiver with ID ${receiverId} not found.`, users); // Log the active users list
                }
            }
            catch (error) {
                console.error("Error sending friend request:", error);
            }
        }));
        // Handle user disconnection
        socket.on("disconnect", () => {
            const disconnectedUser = users.find((user) => user.socketId === socket.id);
            if (disconnectedUser) {
                console.log(`😔 User disconnected! UserId: ${disconnectedUser.userId}, SocketId: ${socket.id}`);
            }
            else {
                console.log(`😔 User disconnected: ${socket.id}`);
            }
            users = users.filter((user) => user.socketId !== socket.id);
            broadcastUsersList(io);
        });
    });
};
exports.default = initializeSocket;
