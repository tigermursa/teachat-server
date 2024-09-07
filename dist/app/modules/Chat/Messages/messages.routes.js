"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MassageRoute = void 0;
const express_1 = __importDefault(require("express"));
const messages_controller_1 = require("./messages.controller");
const router = express_1.default.Router();
router.post("/message", messages_controller_1.messageController.sendMessage);
router.get("/message/:conversationId", messages_controller_1.messageController.getMessages);
exports.MassageRoute = router;
