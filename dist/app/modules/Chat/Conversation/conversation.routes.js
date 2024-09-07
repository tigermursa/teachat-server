"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRoute = void 0;
const express_1 = __importDefault(require("express"));
const conversation_controller_1 = require("./conversation.controller");
const router = express_1.default.Router();
router.post("/conversation", conversation_controller_1.ConversationController.createConversation);
router.get("/conversations/:userId", conversation_controller_1.ConversationController.getUserConversations);
exports.ConversationRoute = router;
