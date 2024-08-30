import { Schema, model, Model } from "mongoose";
import { IUser } from "./user.interface";

export type UserModel = Model<IUser>;

const userSchema: Schema = new Schema<IUser, UserModel>({
  username: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    default: null,
  },
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: null,
  },
  friendRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export const User: UserModel = model<IUser, UserModel>("User", userSchema);
