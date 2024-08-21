import { Model } from "mongoose";

export interface UserWithStatic extends Model<TUser> {
  createUser(userData: Partial<TUser>): unknown;
  isUserExists(id: string): Promise<TUser | null>;
}

export type TUser = {
  userID: string;
  name: string;
  email: string;
  location: string;
  gender: "male" | "female";
  age: string;
  work: string;
  userImage: string;
  password: string;
  isDeleted: boolean;
};
