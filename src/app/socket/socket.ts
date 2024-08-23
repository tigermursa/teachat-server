import { Server, Socket } from "socket.io";
import { Document, Model } from "mongoose";
import UserModel from "../modules/user/user.model";


// Define the shape of a User document from Mongoose
interface IUser extends Document {
  username: string;
  email: string;
}

// Define the shape of the User object in the users array
interface SocketUser {
  userId: string;
  socketId: string;
}

// Users array to store connected users
let users: SocketUser[] = [];

// Helper function to find a user by userId
const findUserById = (userId: string): SocketUser | undefined =>
  users.find((user) => user.userId === userId);

// Helper function to broadcast updated users list
const broadcastUsersList = (io: Server): any => io.emit("getUsers", users);

// Initialize Socket.io
const initializeSocket = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    console.log("😉 User connected!", socket.id);

    // Add a new user to the users array
    socket.on("addUser", (userId: string) => {
      if (!findUserById(userId)) {
        users.push({ userId, socketId: socket.id });
        broadcastUsersList(io);
      }
    });

    // Handle sending messages between users
    socket.on(
      "sendMessage",
      async ({
        senderId,
        receiverId,
        message,
        conversationId,
      }: {
        senderId: string;
        receiverId: string;
        message: string;
        conversationId: string;
      }) => {
        try {
          const receiver = findUserById(receiverId);
          const sender = findUserById(senderId);

          if (!sender) {
            console.error(`Sender with ID ${senderId} not found.`);
            return;
          }

          const user: IUser | null = await UserModel.findById(senderId).select(
            "fullName email"
          );

          if (!user) {
            console.error(`User with ID ${senderId} not found in database.`);
            return;
          }

          const messageData = {
            senderId,
            message,
            conversationId,
            receiverId,
            user: {
              id: user._id,
              username: user?.username,
              email: user.email,
            },
          };

          // Send message to both sender and receiver if they are online
          if (receiver) {
            io.to(receiver.socketId).emit("getMessage", messageData);
          }

          io.to(sender.socketId).emit("getMessage", messageData);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    );

    // Handle user disconnection
    socket.on("disconnect", () => {
      users = users.filter((user) => user.socketId !== socket.id);
      broadcastUsersList(io);
    });
  });
};

export default initializeSocket;
