import { Document } from "mongoose";
export interface IUser extends Document {
  username: string;
  email: string;
  location: string;
  password: string;
  gender: string;
  age: string;
  work: string;
  userImage: string;
}
