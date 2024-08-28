import { Request, Response } from "express";
import Conversation from "./conversation.model";
import Message from "./message.model";
import { User } from "../user/user.model";

interface SendMessageRequest extends Request {
  body: {
    conversationId: string;
    senderId: string;
    message: string;
    receiverId?: string;
  };
}

interface GetMessagesRequest extends Request {
  params: {
    conversationId: string;
  };
  query: {
    senderId?: string;
    receiverId?: string;
  };
}

export const sendMessage = async (
  req: SendMessageRequest,
  res: Response
): Promise<Response> => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;

    if (!senderId || !message) {
      return res.status(400).send("Please fill all required fields");
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
      return res.status(400).send("Please fill all required fields");
    } else {
      newMessage = new Message({ conversationId, senderId, message });
    }

    await newMessage.save();

    // Return the new message with the createdAt timestamp
    return res.status(200).json({
      message: "Message sent successfully",
      data: {
        conversationId: newMessage.conversationId,
        senderId: newMessage.senderId,
        message: newMessage.message,
        createdAt: newMessage.createdAt, // Return createdAt field
      },
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send("An error occurred while sending the message");
  }
};

export const getMessages = async (
  req: GetMessagesRequest,
  res: Response
): Promise<Response> => {
  try {
    const { conversationId } = req.params;
    const { senderId, receiverId } = req.query;

    const fetchMessages = async (conversationId: string) => {
      const messages = await Message.find({ conversationId }).lean();
      return await Promise.all(
        messages.map(async (msg) => {
          const user = await User.findById(msg.senderId).lean();
          return {
            user: {
              id: user?._id,
              email: user?.email,
              username: user?.username,
            },
            message: msg.message,
            createdAt: msg.createdAt, // Include the createdAt timestamp
          };
        })
      );
    };

    if (conversationId === "new") {
      if (!senderId || !receiverId) {
        return res.status(400).send("SenderId and ReceiverId are required");
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
    console.log("Error", error);
    return res
      .status(500)
      .send("An error occurred while fetching the messages");
  }
};


export const messageController = { sendMessage, getMessages };
