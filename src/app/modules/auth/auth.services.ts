
import UserModel from "../user/user.model";
import { IUser } from "./auth.interface";


export async function findUserByEmail(email: string): Promise<IUser | null> {
    return await UserModel.findOne({ email });
}

export const AuthService = {
    findUserByEmail,
};
