import { Model } from "mongoose";
import UserModel from "../user/user.model";
import { TUser } from "../user/user.interface";

export interface UserWithStatic extends Model<TUser> {
  isUserExists(id: string): Promise<TUser | null>;
}

export async function findUserByEmail(email: string): Promise<TUser | null> {
  return await UserModel.findOne({ email });
}

export async function createUser(userData: Partial<TUser>): Promise<TUser> {
  const newUser = new UserModel(userData);
  return await newUser.save();
}

export const AuthService = {
  findUserByEmail,
  createUser,
};
