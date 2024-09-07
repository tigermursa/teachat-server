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
exports.FriendServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const sendFriendRequest = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(senderId) ||
        !mongoose_1.default.Types.ObjectId.isValid(receiverId)) {
        throw new Error("Invalid user IDs.");
    }
    const sender = yield user_model_1.User.findById(senderId);
    const receiver = yield user_model_1.User.findById(receiverId);
    if (!receiver || !sender) {
        throw new Error("Sender or receiver does not exist.");
    }
    if (receiver.friendRequests.includes(senderId) ||
        receiver.friends.includes(senderId)) {
        throw new Error("Friend request already sent or you are already friends.");
    }
    // Add sender's ID to receiver's friendRequests
    receiver.friendRequests.push(senderId);
    // Add receiver's ID to sender's sentFriendRequests
    sender.sentFriendRequests.push(receiverId);
    yield receiver.save();
    yield sender.save();
    return receiver;
});
const acceptFriendRequest = (userId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(userId) ||
        !mongoose_1.default.Types.ObjectId.isValid(senderId)) {
        throw new Error("Invalid user IDs.");
    }
    const user = yield user_model_1.User.findById(userId);
    const sender = yield user_model_1.User.findById(senderId);
    if (!user || !sender) {
        throw new Error("User not found.");
    }
    if (!user.friendRequests.includes(senderId)) {
        throw new Error("No friend request found from this user.");
    }
    // Remove the sender's ID from the user's friendRequests array
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== senderId.toString());
    // Add the sender's ID to the user's friends array
    user.friends.push(senderId);
    // Add the user's ID to the sender's friends array
    sender.friends.push(userId);
    // Remove the user's ID from the sender's sentFriendRequests array
    sender.sentFriendRequests = sender.sentFriendRequests.filter((id) => id.toString() !== userId.toString());
    yield user.save();
    yield sender.save();
    return user;
});
const rejectFriendRequest = (userId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(userId) ||
        !mongoose_1.default.Types.ObjectId.isValid(senderId)) {
        throw new Error("Invalid user IDs.");
    }
    const user = yield user_model_1.User.findById(userId);
    const sender = yield user_model_1.User.findById(senderId);
    if (!user || !sender) {
        throw new Error("User or sender not found.");
    }
    // Remove the sender's ID from the user's friendRequests array
    user.friendRequests = user.friendRequests.filter((id) => id.toString() !== senderId.toString());
    // Remove the user's ID from the sender's sentFriendRequests array
    sender.sentFriendRequests = sender.sentFriendRequests.filter((id) => id.toString() !== userId.toString());
    yield user.save();
    yield sender.save();
    return user;
});
const getFriendsList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID.");
    }
    const user = yield user_model_1.User.findById(userId).populate("friends", "username email");
    if (!user) {
        throw new Error("User not found.");
    }
    return user.friends;
});
//get users thats not my friends
const getNonFriends = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID.");
    }
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error("User not found.");
    }
    // Get the list of friends
    const friendsIds = user.friends;
    // Get all users excluding the current user
    const nonFriends = yield user_model_1.User.find({
        _id: { $ne: userId, $nin: friendsIds },
    }).select("username email userImage");
    return nonFriends;
});
//unfriend user
const unfriendUser = (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(userId) ||
        !mongoose_1.default.Types.ObjectId.isValid(friendId)) {
        throw new Error("Invalid user IDs.");
    }
    const user = yield user_model_1.User.findById(userId);
    const friend = yield user_model_1.User.findById(friendId);
    if (!user || !friend) {
        throw new Error("User or friend not found.");
    }
    // Remove friendId from user's friends list
    user.friends = user.friends.filter((id) => id.toString() !== friendId.toString());
    // Remove userId from friend's friends list
    friend.friends = friend.friends.filter((id) => id.toString() !== userId.toString());
    yield user.save();
    yield friend.save();
    return {
        user,
        friend,
    };
});
exports.FriendServices = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendsList,
    getNonFriends,
    unfriendUser,
};
