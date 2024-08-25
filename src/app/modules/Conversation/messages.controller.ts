import { Request, Response } from "express";
import Conversation from "./conversation.model";
import Message from "./message.model";
import UserModel from "../user/user.model";

// Send Message
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;

    if (!senderId || !message) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    let newMessage;

    if (conversationId === "new" && receiverId) {
      let conversation = await Conversation.findOne({
        members: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          members: [senderId, receiverId],
        });
        await conversation.save();
      }

      newMessage = new Message({
        conversationId: conversation._id,
        senderId,
        message,
      });
    } else if (!conversationId && !receiverId) {
      return res.status(400).json({ error: "Please fill all required fields" });
    } else {
      newMessage = new Message({ conversationId, senderId, message });
    }

    await newMessage.save();
    return res.status(200).json({ message: "Message sent successfully" });
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
              username: user?.name,
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
