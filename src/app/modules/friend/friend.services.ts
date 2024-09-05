import mongoose, { ObjectId } from "mongoose";
import { User } from "../user/user.model";

const sendFriendRequest = async (senderId: string, receiverId: string) => {
  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(receiverId)
  ) {
    throw new Error("Invalid user IDs.");
  }

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!receiver || !sender) {
    throw new Error("Sender or receiver does not exist.");
  }

  if (
    receiver.friendRequests.includes(senderId) ||
    receiver.friends.includes(senderId)
  ) {
    throw new Error("Friend request already sent or you are already friends.");
  }

  // Add sender's ID to receiver's friendRequests
  receiver.friendRequests.push(senderId);
  // Add receiver's ID to sender's sentFriendRequests
  sender.sentFriendRequests.push(receiverId);

  await receiver.save();
  await sender.save();

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

  // Remove the sender's ID from the user's friendRequests array
  user.friendRequests = user.friendRequests.filter(
    (id) => id.toString() !== senderId.toString()
  );

  // Add the sender's ID to the user's friends array
  user.friends.push(senderId);

  // Add the user's ID to the sender's friends array
  sender.friends.push(userId);

  // Remove the user's ID from the sender's sentFriendRequests array
  sender.sentFriendRequests = sender.sentFriendRequests.filter(
    (id) => id.toString() !== userId.toString()
  );

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
  const sender = await User.findById(senderId);

  if (!user || !sender) {
    throw new Error("User or sender not found.");
  }

  // Remove the sender's ID from the user's friendRequests array
  user.friendRequests = user.friendRequests.filter(
    (id) => id.toString() !== senderId.toString()
  );

  // Remove the user's ID from the sender's sentFriendRequests array
  sender.sentFriendRequests = sender.sentFriendRequests.filter(
    (id) => id.toString() !== userId.toString()
  );

  await user.save();
  await sender.save();

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

//get users thats not my friends
const getNonFriends = async (userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found.");
  }

  // Get the list of friends
  const friendsIds = user.friends;

  // Get all users excluding the current user
  const nonFriends = await User.find({
    _id: { $ne: userId, $nin: friendsIds },
  }).select("username email userImage");

  return nonFriends;
};

//unfriend user
const unfriendUser = async (userId: string, friendId: string) => {
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(friendId)
  ) {
    throw new Error("Invalid user IDs.");
  }

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    throw new Error("User or friend not found.");
  }

  // Remove friendId from user's friends list
  user.friends = user.friends.filter(
    (id) => id.toString() !== friendId.toString()
  );

  // Remove userId from friend's friends list
  friend.friends = friend.friends.filter(
    (id) => id.toString() !== userId.toString()
  );

  await user.save();
  await friend.save();

  return {
    user,
    friend,
  };
};

export const FriendServices = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
  getNonFriends,
  unfriendUser,
};
