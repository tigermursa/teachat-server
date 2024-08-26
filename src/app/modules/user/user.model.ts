import { Schema, model, Model, Document } from "mongoose";

export interface IUser extends Document {
  receiverId: string;
  username: string;
  email: string;
  location: string;
  password: string | null;
  gender: string;
  age: string;
  work: string;
  userImage: string | null;
}

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
});

export const User: UserModel = model<IUser, UserModel>("User", userSchema);
