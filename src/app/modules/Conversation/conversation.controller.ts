import { Request, Response } from "express";
import Conversation from "./conversation.model";
import UserModel from "../user/user.model";


interface IUser {
  _id: string;
  email: string;
  username: string;
}

interface IConversation {
  _id: string;
  members: string[];
}

const createConversation = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { senderId, receiverId }: { senderId: string; receiverId: string } =
      req.body;

    if (!senderId || !receiverId) {
      return res.status(400).send("Sender and receiver IDs are required");
    }

    const existingConversation: IConversation | null =
      await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      }).lean();

    if (existingConversation) {
      return res.status(200).json({ conversationId: existingConversation._id });
    }

    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
    await newConversation.save();

    return res.status(200).json({ conversationId: newConversation._id });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return res
      .status(500)
      .send("An error occurred while creating the conversation");
  }
};

const getUserConversations = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId: string = req.params.userId;

    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    const conversations: IConversation[] = await Conversation.find({
      members: { $in: [userId] },
    }).lean();

    const conversationUserData = await Promise.all(
      conversations.map(
        async (
          conversation
        ): Promise<{
          user: { receiverId: string; email: string; fullName: string } | null;
          conversationId: string;
        }> => {
          const receiverId = conversation.members.find(
            (member) => member !== userId
          ) as string;

          const user: IUser | null = await UserModel.findById(receiverId).lean();

          if (!user) {
            console.warn(`User with ID ${receiverId} not found, skipping.`);
            return {
              user: null, // Return null or handle the missing user case accordingly
              conversationId: conversation._id,
            };
          }

          return {
            user: {
              receiverId: user._id,
              email: user.email,
              fullName: user.username,
            },
            conversationId: conversation._id,
          };
        }
      )
    );

    // Filter out conversations with null users (optional)
    const filteredConversations = conversationUserData.filter(
      (data) => data.user !== null
    );

    return res.status(200).json(filteredConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return res
      .status(500)
      .send("An error occurred while fetching the conversations");
  }
};

export const ConversationController = {
  createConversation,
  getUserConversations,
};
