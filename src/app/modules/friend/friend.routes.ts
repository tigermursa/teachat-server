import express from "express";
import { FriendController } from "./friend.controller";

const router = express.Router();

router.post("/friend-request", FriendController.sendFriendRequest); // Send friend request
router.post("/friend-request/accept", FriendController.acceptFriendRequest); // Accept friend request
router.post("/friend-request/decline", FriendController.rejectFriendRequest); // Decline friend request
router.get("/friends/:id", FriendController.getFriendsList); // Get all friends
router.get("/non-friends/:id", FriendController.getNonFriends); // Get non-friends list

export const FriendRoutes = router;
