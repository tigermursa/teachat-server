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
exports.ConversationController = void 0;
const conversation_model_1 = __importDefault(require("./conversation.model"));
const user_model_1 = require("../../user/user.model");
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverId } = req.body;
        if (!senderId || !receiverId) {
            return res.status(400).send("Sender and receiver IDs are required");
        }
        const existingConversation = yield conversation_model_1.default.findOne({
            members: { $all: [senderId, receiverId] },
        }).lean();
        if (existingConversation) {
            return res.status(200).json({ conversationId: existingConversation._id });
        }
        const newConversation = new conversation_model_1.default({
            members: [senderId, receiverId],
        });
        yield newConversation.save();
        return res.status(200).json({ conversationId: newConversation._id });
    }
    catch (error) {
        console.error("Error creating conversation:", error);
        return res
            .status(500)
            .send("An error occurred while creating the conversation");
    }
});
const getUserConversations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).send("User ID is required");
        }
        const conversations = yield conversation_model_1.default.find({
            members: { $in: [userId] },
        }).lean();
        const conversationUserData = yield Promise.all(conversations.map((conversation) => __awaiter(void 0, void 0, void 0, function* () {
            const receiverId = conversation.members.find((member) => member !== userId);
            const user = yield user_model_1.User.findById(receiverId).lean();
            if (!user) {
                console.warn(`User with ID ${receiverId} not found, skipping.`);
                return {
                    user: null, // Return null or handle the missing user case accordingly
                    conversationId: conversation._id,
                };
            }
            return {
                user: {
                    receiverId: user._id,
                    email: user.email,
                    fullName: user.username,
                },
                conversationId: conversation._id,
            };
        })));
        // Filter out conversations with null users (optional)
        const filteredConversations = conversationUserData.filter((data) => data.user !== null);
        return res.status(200).json(filteredConversations);
    }
    catch (error) {
        console.error("Error fetching conversations:", error);
        return res
            .status(500)
            .send("An error occurred while fetching the conversations");
    }
});
exports.ConversationController = {
    createConversation,
    getUserConversations,
};
