import express from "express";
import { messageController } from "./messages.controller";

const router = express.Router();

router.post("/message", messageController.sendMessage);
router.get("/message/:conversationId", messageController.getMessages);

export const MassageRoute = router;
