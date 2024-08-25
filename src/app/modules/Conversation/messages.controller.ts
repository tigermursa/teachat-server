import { Request, Response } from "express";
import Conversation from "./conversation.model";
import Message from "./message.model";
import UserModel from "../user/user.model";

// Send Message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, senderId, message, receiverId } = req.body;

    if (!senderId || !message) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    let conversation;
    let newMessage;

    // Check if the conversation ID is provided
    if (conversationId && conversationId !== "new") {
      // Find the conversation by its ID
      conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      // Create a new message for the existing conversation
      newMessage = new Message({
        conversationId,
        senderId,
        message,
      });
    } else if (receiverId) {
      // Find an existing conversation between the sender and receiver
      conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        // If no conversation exists, create a new one
        conversation = new Conversation({
          members: [senderId, receiverId],
        });
        await conversation.save();
      }

      // Create a new message for the found or newly created conversation
      newMessage = new Message({
        conversationId: conversation._id,
        senderId,
        message,
      });
    } else {
      return res
        .status(400)
        .json({ error: "Receiver ID is required for a new conversation" });
    }

    // Save the new message to the database
    await newMessage.save();

    // Return the message and conversation ID
    return res.status(200).json({
      message: newMessage,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while sending the message" });
  }
};
// Get Messages
export const getMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { conversationId } = req.params;
    const { senderId, receiverId } = req.query;

    const fetchMessages = async (conversationId: string) => {
      const messages = await Message.find({ conversationId }).lean();
      return await Promise.all(
        messages.map(async (msg) => {
          const user = await UserModel.findById(msg.senderId).lean();
          return {
            user: {
              id: user?._id,
              email: user?.email,
              name: user?.name,
            },
            message: msg.message,
          };
        })
      );
    };

    if (conversationId === "new") {
      if (!senderId || !receiverId) {
        return res
          .status(400)
          .json({ error: "SenderId and ReceiverId are required" });
      }

      const conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (conversation) {
        const messages = await fetchMessages(conversation._id as string);
        return res.status(200).json(messages);
      } else {
        return res.status(200).json([]);
      }
    } else {
      const messages = await fetchMessages(conversationId);
      return res.status(200).json(messages);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the messages" });
  }
};

// Export message controller
export const messageController = { sendMessage, getMessages };
