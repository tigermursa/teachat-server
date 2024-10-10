import { Request, Response } from "express";
import Conversation from "./conversation.model";
import { User } from "../../user/user.model";

// Define your IUser and IConversation interfaces
interface IUser {
  _id: string;
  email: string;
  username: string;
}

interface IConversation {
  _id: string;
  members: string[];
}

// Create conversation controller
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

    // Use lean() with IConversation type
    const existingConversation: IConversation | null =
      await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      }).lean<IConversation>();

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

// Get user conversations controller
const getUserConversations = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId: string = req.params.userId;

    if (!userId) {
      return res.status(400).send("User ID is required");
    }

    // Use lean() with IConversation type
    const conversations: IConversation[] = await Conversation.find({
      members: { $in: [userId] },
    }).lean<IConversation[]>();

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

          // Use lean() with IUser type to get plain object
          const user: IUser | null = await User.findById(
            receiverId
          ).lean<IUser>();

          if (!user) {
            console.warn(`User with ID ${receiverId} not found, skipping.`);
            return {
              user: null,
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

// Export the conversation controller
export const ConversationController = {
  createConversation,
  getUserConversations,
};
