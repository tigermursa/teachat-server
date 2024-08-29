import { Model } from "mongoose";
import { User } from "../user/user.model";
import { IUser } from "../user/user.interface";

export interface UserWithStatic extends Model<IUser> {
  isUserExists(id: string): Promise<IUser | null>;
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return await User.findOne({ email });
}

export async function createUser(userData: Partial<IUser>): Promise<IUser> {
  const newUser = new User(userData);
  return await newUser.save();
}

export const AuthService = {
  findUserByEmail,
  createUser,
};
