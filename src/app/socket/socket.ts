import { Server, Socket } from "socket.io";
import { User } from "../modules/user/user.model";

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
const broadcastUsersList = (io: Server): void => {
  io.emit("getUsers", users);
};

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

          const user = await User.findById(senderId).select("username email");

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
              username: user.username,
              email: user.email,
            },
          };

          if (receiver) {
            io.to(receiver.socketId).emit("getMessage", messageData);
          }

          io.to(sender.socketId).emit("getMessage", messageData);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    );
    //res
    socket.on("sendFriendRequest", async ({ senderId, receiverId }) => {
      try {
        const receiver = findUserById(receiverId);
        const sender = await User.findById(senderId).select("username");

        if (!sender) {
          console.error(`Sender with ID ${senderId} not found in database.`);
          return;
        }

        if (receiver) {
          // Emit the friend request event to the receiver
          io.to(receiver.socketId).emit("friendRequest", {
            senderId,
            senderUsername: sender.username,
          });
          console.log(
            `😇 Friend request sent from ${sender.username} to user ${receiverId}`
          );
        } else {
          console.error(`Receiver with ID ${receiverId} not found.`, users); // Log the active users list
        }
      } catch (error) {
        console.error("Error sending friend request:", error);
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      const disconnectedUser = users.find(
        (user) => user.socketId === socket.id
      );

      if (disconnectedUser) {
        console.log(
          `😔 User disconnected! UserId: ${disconnectedUser.userId}, SocketId: ${socket.id}`
        );
      } else {
        console.log(`😔 User disconnected: ${socket.id}`);
      }

      users = users.filter((user) => user.socketId !== socket.id);
      broadcastUsersList(io);
    });
  });
};

export default initializeSocket;
