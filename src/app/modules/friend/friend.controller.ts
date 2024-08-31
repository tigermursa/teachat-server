import { Request, Response } from "express";
import { FriendServices } from "./friend.services";

const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.body;
    const result = await FriendServices.sendFriendRequest(senderId, receiverId);
    res.status(200).json({
      success: true,
      message: "Friend request sent successfully ✔",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const { userId, senderId } = req.body;
    const result = await FriendServices.acceptFriendRequest(userId, senderId);
    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully ✔",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectFriendRequest = async (req: Request, res: Response) => {
  try {
    const { userId, senderId } = req.body;
    const result = await FriendServices.rejectFriendRequest(userId, senderId);
    res.status(200).json({
      success: true,
      message: "Friend request rejected successfully ✔",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
//accept request
const getFriendsList = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await FriendServices.getFriendsList(userId);
    res.status(200).json({
      success: true,
      message: "Friends list retrieved successfully ✔",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//not my friends
const getNonFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await FriendServices.getNonFriends(userId);
    res.status(200).json({
      success: true,
      message: "Non-friends list retrieved successfully ✔",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const FriendController = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
  getNonFriends,
};
