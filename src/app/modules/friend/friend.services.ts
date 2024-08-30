import mongoose, { ObjectId } from "mongoose";
import { User } from "../user/user.model";

const sendFriendRequest = async (senderId: string, receiverId: string) => {
  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(receiverId)
  ) {
    throw new Error("Invalid user IDs.");
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    throw new Error("Receiver does not exist.");
  }

  if (
    receiver.friendRequests.includes(senderId) ||
    receiver.friends.includes(senderId)
  ) {
    throw new Error("Friend request already sent or you are already friends.");
  }

  receiver.friendRequests.push(senderId);
  await receiver.save();

  return receiver;
};

const acceptFriendRequest = async (userId: string, senderId: string) => {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(senderId)
  ) {
    throw new Error("Invalid user IDs.");
  }

  const user = await User.findById(userId);
  const sender = await User.findById(senderId);

  if (!user || !sender) {
    throw new Error("User not found.");
  }

  if (!user.friendRequests.includes(senderId)) {
    throw new Error("No friend request found from this user.");
  }

  user.friendRequests = user.friendRequests.filter(
    (id) => id.toString() !== senderId.toString()
  );
  user.friends.push(senderId);
  sender.friends.push(userId);

  await user.save();
  await sender.save();

  return user;
};

const rejectFriendRequest = async (userId: string, senderId: string) => {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(senderId)
  ) {
    throw new Error("Invalid user IDs.");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  user.friendRequests = user.friendRequests.filter(
    (id) => id.toString() !== senderId.toString()
  );
  await user.save();

  return user;
};

const getFriendsList = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID.");
  }

  const user = await User.findById(userId).populate(
    "friends",
    "username email"
  );
  if (!user) {
    throw new Error("User not found.");
  }

  return user.friends;
};

export const FriendServices = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
};
