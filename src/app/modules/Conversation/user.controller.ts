import { Request, Response } from "express";
import { TUser } from "../user/user.interface";
import UserModel from "../user/user.model";

interface UserResponse {
  email: string;
  name: string;
  receiverId: string;
  userImage: string;
}

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    // Fetch users excluding the one with the given userId
    const users: TUser[] = await UserModel.find({ _id: { $ne: userId } });

    // Map through the users to extract relevant data
    const usersData: UserResponse[] = users.map((user) => ({
      email: user.email,
      name: user.name,
      receiverId: user._id as string,
      userImage: user.userImage,
    }));

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
