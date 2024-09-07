import { Document } from "mongoose";
export interface IUser extends Document {
  username: string;
  email: string;
  location: string;
  password: string;
  gender: string;
  age: number;
  work: string;
  userImage: string;
  friendRequests: string[];
  friends: string[];
  sentFriendRequests: string[];
}
