import { Request, Response } from "express";

import { UserServices } from "./user.services";




// Get-All
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { users, totalUsers } = await UserServices.getAllUsersFromDB();
    res.status(200).json({
      success: true,
      message: "User data retrieved successfully ✔",

      totalUsers: totalUsers,
      data: users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong !!!",
      error: error.message,
    });
  }
};

// Get One
const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await UserServices.getSingleUserFromDB(userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Invalid ID or user does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Single user retrieved successfully ✔",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong !!!",
      error: error.message,
    });
  }
};

// Delete One
const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await UserServices.deleteUserFromDB(userId);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid ID or user does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong !!!",
      error: error.message,
    });
  }
};

//Update One
const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const result = await UserServices.updateUserFromDB(userId, updatedData);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid ID or user does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating the user!",
      error: error.message,
    });
  }
};

export const UsersController = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateUser,
};
