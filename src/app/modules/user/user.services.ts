import mongoose, { ObjectId } from "mongoose";
import { TUser } from "./user.interface";
import UserModel from "./user.model";

//post
const createUserIntoDB = async (data: TUser) => {
  if (await UserModel.isUserExists(data.email)) {
    throw new Error("This email already exist!");
  }
  const result = await UserModel.create(data); //builtin static method using
  return result;
};

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
    const result = await UserModel.updateOne({ _id }, { $set: updatedData });
    return result;
  } catch (error: any) {
    console.error("error updating user:", error.message);
    throw new Error("error updating user: " + error.message);
  }
};

//exports:
export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserFromDB,
};
