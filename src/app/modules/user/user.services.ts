import { ObjectId } from "mongoose";
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
  const result = await UserModel.find();
  return result;
};

// getSingle task
const getSingleUserFromDB = async (id: string) => {
  const result = await UserModel.findOne({ _id: id });
  return result;
};

// delete
const deleteUserFromDB = async (_id: string) => {
  const result = await UserModel.updateOne({ _id }, { isDeleted: true });
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
