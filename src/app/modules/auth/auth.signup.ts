import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.services";
import { CustomError } from "../../errors/CustomError";

import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { IUser } from "../user/user.interface";

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const {
    username,
    email,
    password,
    confirmPassword,
    gender,
    location,
    age,
    work,
    userImage,
  } = req.body;

  try {
    // Check if user already exists
    const validUser = await AuthService.findUserByEmail(email);
    if (validUser) {
      throw new CustomError("User already exists", 400);
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new CustomError("Passwords don't match", 400);
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create user data
    const userData: Partial<IUser> = {
      username,
      email,
      password: hashedPassword,
      gender,
      location,
      age,
      work,
      userImage,
    };

    // Save the user
    const newUser = await AuthService.createUser(userData);

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.EXPIRES_IN }
    );

    // Set HTTP-only, Secure, and SameSite cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true, // Set 'secure' to true in production
        sameSite: "none", // Adjust sameSite for production
      })
      .status(201)
      .json({
        message: "User registered successfully!",
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        userImage: newUser.userImage,
      });
  } catch (error) {
    next(error);
  }
}
