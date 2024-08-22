import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.services";
import { CustomError } from "../../errors/CustomError";
import { TUser } from "../user/user.interface";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const {
    name,
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
    const userData: Partial<TUser> = {
      name,
      email,
      password: hashedPassword,
      gender,
      location,
      age,
      work,
      userImage,
      isDeleted: false,
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
        secure: process.env.NODE_ENV === "production", // Set 'secure' in production
        sameSite: "lax", // Controls sending of cookies with cross-site requests
      })
      .status(201)
      .json({
        message: "User registered successfully!",
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userImage: newUser.userImage,
      });
  } catch (error) {
    next(error);
  }
}
