import { Request, Response } from "express";
import Conversation from "./conversation.model";
import UserModel from "../user/user.model";
import { TUser } from "../user/user.interface";

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
          user: { receiverId: string; email: string; username: string };
          conversationId: string;
        }> => {
          const receiverId = conversation.members.find(
            (member) => member !== userId
          ) as string;

          const user: TUser | null = await UserModel.findById(
            receiverId
          ).lean();

          if (!user) {
            throw new Error(`User with ID ${receiverId} not found`);
          }

          return {
            user: {
              receiverId: user._id,
              email: user.email,
              username: user.name,
            },
            conversationId: conversation._id,
          };
        }
      )
    );

    return res.status(200).json(conversationUserData);
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
