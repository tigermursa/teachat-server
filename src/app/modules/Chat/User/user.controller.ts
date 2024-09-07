import { Request, Response } from "express";
import { IUser } from "../../user/user.interface";
import { User } from "../../user/user.model";

interface UserResponse {
  user: {
    email: string;
    username: string;
    receiverId: string;
  };
}

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    // Fetch users excluding the one with the given userId
    const users: IUser[] = await User.find({ _id: { $ne: userId } });

    // Map through the users to extract relevant data
    const usersData: UserResponse[] = await Promise.all(
      users.map(async (user) => ({
        user: {
          email: user.email,
          username: user.username,
          receiverId: user._id as string,
          userImage: user.userImage,
        },
      }))
    );

    // Send the response with usersData
    res.status(200).json(usersData);
  } catch (error) {
    console.error("Error", error);
    res.status(500).send("An error occurred while fetching users");
  }
};

export const UserController = {
  getUsers,
};
