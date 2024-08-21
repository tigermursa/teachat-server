import mongoose, { ObjectId } from "mongoose";
import { TUser } from "./user.interface";
import UserModel from "./user.model";

// getAll data
const getAllUsersFromDB = async () => {
  const users = await UserModel.find().exec(); // Retrieve all users
  const totalUsers = await UserModel.countDocuments().exec(); // Count total users
  return { users, totalUsers };
};

// getSingle user
const getSingleUserFromDB = async (id: string) => {
  try {
    // Validate if the ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const result = await UserModel.findOne({ _id: id }).exec();
    return result;
  } catch (error) {
    throw new Error("Error retrieving user from database");
  }
};

// delete
const deleteUserFromDB = async (_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return { matchedCount: 0 }; // Return no match if ID is invalid
  }

  // Check if the user exists
  const userExists = await UserModel.findById(_id).exec();
  if (!userExists) {
    return { matchedCount: 0 }; // Return no match if user does not exist
  }

  // Mark user as deleted
  const result = await UserModel.updateOne({ _id }, { isDeleted: true }).exec();
  return result;
};

//update

const updateUserFromDB = async (
  _id: string | ObjectId,
  updatedData: Partial<TUser>
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(_id as string)) {
      return { matchedCount: 0 }; // Return no match if ID is invalid
    }

    // Check if the user exists
    const userExists = await UserModel.findById(_id).exec();
    if (!userExists) {
      return { matchedCount: 0 }; // Return no match if user does not exist
    }

    // Perform the update
    const result = await UserModel.updateOne(
      { _id },
      { $set: updatedData }
    ).exec();
    return result;
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    throw new Error("Error updating user: " + error.message);
  }
};
//exports:
export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserFromDB,
};
