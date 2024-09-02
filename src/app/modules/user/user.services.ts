import mongoose, { ObjectId } from "mongoose";
import { User } from "./user.model";
import { IUser } from "./user.interface";

// getAll data
const getAllUsersFromDB = async () => {
  const users = await User.find().exec(); // Retrieve all users
  const totalUsers = await User.countDocuments().exec(); // Count total users
  return { users, totalUsers };
};

// getSingle user
const getSingleUserFromDB = async (id: string) => {
  try {
    // Validate if the ID is a valid MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const result = await User.findOne({ _id: id }).exec();
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
  const userExists = await User.findById(_id).exec();
  if (!userExists) {
    return { matchedCount: 0 }; // Return no match if user does not exist
  }

  // Mark user as deleted
  const result = await User.updateOne({ _id }, { isDeleted: true }).exec();
  return result;
};

//update

const updateUserFromDB = async (
  _id: string | ObjectId,
  updatedData: Partial<IUser>
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(_id as string)) {
      return { matchedCount: 0 }; // Return no match if ID is invalid
    }

    // Check if the user exists
    const userExists = await User.findById(_id).exec();
    if (!userExists) {
      return { matchedCount: 0 }; // Return no match if user does not exist
    }

    // Perform the update
    const result = await User.updateOne({ _id }, { $set: updatedData }).exec();
    return result;
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    throw new Error("Error updating user: " + error.message);
  }
};

const getUsersDetailByIDArray = async (userIds: string[]) => {
  try {
    // Validate if all IDs are valid MongoDB ObjectId formats
    const validIds = userIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validIds.length === 0) {
      return null;
    }

    // Find users whose IDs match the valid ones in the array and project specific fields
    const users = await User.find({ _id: { $in: validIds } })
      .select("_id username userImage work age email") // Only include the fields you need
      .exec();

    return users;
  } catch (error) {
    throw new Error("Error retrieving users from database");
  }
};

//exports:
export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
  updateUserFromDB,
  getUsersDetailByIDArray,
};
