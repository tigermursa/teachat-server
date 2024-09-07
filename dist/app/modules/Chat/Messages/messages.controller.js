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
exports.messageController = exports.getMessages = exports.sendMessage = void 0;
const conversation_model_1 = __importDefault(require("../Conversation/conversation.model"));
const message_model_1 = __importDefault(require("./message.model"));
const user_model_1 = require("../../user/user.model");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId, senderId, message, receiverId = "" } = req.body;
        if (!senderId || !message) {
            return res.status(400).send("Please fill all required fields");
        }
        let newMessage;
        if (conversationId === "new" && receiverId) {
            let conversation = yield conversation_model_1.default.findOne({
                members: { $all: [senderId, receiverId] },
            });
            if (!conversation) {
                conversation = new conversation_model_1.default({
                    members: [senderId, receiverId],
                });
                yield conversation.save();
            }
            newMessage = new message_model_1.default({
                conversationId: conversation._id,
                senderId,
                message,
            });
        }
        else if (!conversationId && !receiverId) {
            return res.status(400).send("Please fill all required fields");
        }
        else {
            newMessage = new message_model_1.default({ conversationId, senderId, message });
        }
        yield newMessage.save();
        // Return the new message with the createdAt timestamp
        return res.status(200).json({
            message: "Message sent successfully",
            data: {
                conversationId: newMessage.conversationId,
                senderId: newMessage.senderId,
                message: newMessage.message,
                createdAt: newMessage.createdAt, // Return createdAt field
            },
        });
    }
    catch (error) {
        console.log("Error", error);
        return res.status(500).send("An error occurred while sending the message");
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { conversationId } = req.params;
        const { senderId, receiverId } = req.query;
        const fetchMessages = (conversationId) => __awaiter(void 0, void 0, void 0, function* () {
            const messages = yield message_model_1.default.find({ conversationId }).lean();
            return yield Promise.all(messages.map((msg) => __awaiter(void 0, void 0, void 0, function* () {
                const user = yield user_model_1.User.findById(msg.senderId).lean();
                return {
                    user: {
                        id: user === null || user === void 0 ? void 0 : user._id,
                        email: user === null || user === void 0 ? void 0 : user.email,
                        username: user === null || user === void 0 ? void 0 : user.username,
                    },
                    message: msg.message,
                    createdAt: msg.createdAt, // Include the createdAt timestamp
                };
            })));
        });
        if (conversationId === "new") {
            if (!senderId || !receiverId) {
                return res.status(400).send("SenderId and ReceiverId are required");
            }
            const conversation = yield conversation_model_1.default.findOne({
                members: { $all: [senderId, receiverId] },
            });
            if (conversation) {
                const messages = yield fetchMessages(conversation._id);
                return res.status(200).json(messages);
            }
            else {
                return res.status(200).json([]);
            }
        }
        else {
            const messages = yield fetchMessages(conversationId);
            return res.status(200).json(messages);
        }
    }
    catch (error) {
        console.log("Error", error);
        return res
            .status(500)
            .send("An error occurred while fetching the messages");
    }
});
exports.getMessages = getMessages;
exports.messageController = { sendMessage: exports.sendMessage, getMessages: exports.getMessages };
