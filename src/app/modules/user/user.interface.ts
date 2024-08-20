import { Model } from "mongoose";

export interface UserWithStatic extends Model<TUser> {
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

//! OPTIONAL import { Model, Document } from "mongoose";

// // Define the User document interface extending Mongoose's Document
// export interface TUser extends Document {
//   name: string;
//   email: string;
//   location: string;
//   gender: "male" | "female";
//   userImage: string;
//   password: string;
//   isDeleted: boolean;
// }

// // Extend the Mongoose Model with a custom static method
// export interface UserWithStatic extends Model<TUser> {
//   isUserExists(id: string): Promise<TUser | null>;
// }
