"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FriendRoutes = void 0;
const express_1 = __importDefault(require("express"));
const friend_controller_1 = require("./friend.controller");
const router = express_1.default.Router();
router.post("/friend-request", friend_controller_1.FriendController.sendFriendRequest); // Send friend request
router.post("/friend-request/accept", friend_controller_1.FriendController.acceptFriendRequest); // Accept friend request
router.post("/friend-request/decline", friend_controller_1.FriendController.rejectFriendRequest); // Decline friend request
router.get("/friends/:id", friend_controller_1.FriendController.getFriendsList); // Get all friends
router.get("/non-friends/:id", friend_controller_1.FriendController.getNonFriends); // Get non-friends list
router.post("/friend/unfriend", friend_controller_1.FriendController.unfriendUser); // Unfriend a user
exports.FriendRoutes = router;
