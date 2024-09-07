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
exports.FriendController = void 0;
const friend_services_1 = require("./friend.services");
const sendFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;
        const result = yield friend_services_1.FriendServices.sendFriendRequest(senderId, receiverId);
        res.status(200).json({
            success: true,
            message: "Friend request sent successfully!",
            data: result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong !!!",
            error: error.message,
        });
    }
});
const acceptFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, senderId } = req.body;
        const result = yield friend_services_1.FriendServices.acceptFriendRequest(userId, senderId);
        res.status(200).json({
            success: true,
            message: "Friend request accepted successfully ✔",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
const rejectFriendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, senderId } = req.body;
        const result = yield friend_services_1.FriendServices.rejectFriendRequest(userId, senderId);
        res.status(200).json({
            success: true,
            message: "Friend request rejected successfully ✔",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
//accept request
const getFriendsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const result = yield friend_services_1.FriendServices.getFriendsList(userId);
        res.status(200).json({
            success: true,
            message: "Friends list retrieved successfully ✔",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
//not my friends
const getNonFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const result = yield friend_services_1.FriendServices.getNonFriends(userId);
        res.status(200).json({
            success: true,
            message: "Non-friends list retrieved successfully ✔",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
const unfriendUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, friendId } = req.body;
        const result = yield friend_services_1.FriendServices.unfriendUser(userId, friendId);
        res.status(200).json({
            success: true,
            message: "User unfriended successfully ✔",
            data: result,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
});
exports.FriendController = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendsList,
    getNonFriends,
    unfriendUser,
};
