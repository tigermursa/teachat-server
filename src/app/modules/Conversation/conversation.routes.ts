import express from "express";
import { ConversationController } from "./conversation.controller";

const router = express.Router();

router.post("/conversation", ConversationController.createConversation);
router.get(
  "/conversations/:userId",
  ConversationController.getUserConversations
);

export const ConversationRoute = router;
