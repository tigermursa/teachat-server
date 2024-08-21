import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.services";
import { TUser } from "../user/user.interface";
import { errorHandler } from "../../errors/ErrorHandler";

export async function signup(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const {
    userID,
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
      return next(errorHandler(400, "User already exists"));
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return next(errorHandler(400, "Passwords don't match"));
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create user data
    const userData: Partial<TUser> = {
      userID,
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
      { id: newUser.userID },
      process.env.JWT_SECRET as string
    );

    // Set HTTP-only cookie and respond with success message
    res.cookie("access_token", token, { httpOnly: true }).status(201).json({
      message: "User registered successfully!",
      _id: newUser.userID,
      name: newUser.name,
      email: newUser.email,
      userImage: newUser.userImage,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { email, password } = req.body;

    // Find user by email
    const validUser = await AuthService.findUserByEmail(email);
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    // Check if the password matches
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: validUser.userID },
      process.env.JWT_SECRET as string
    );

    // Set HTTP-only cookie and respond with success message
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      message: "User logged in successfully!",
      _id: validUser.userID,
      name: validUser.name,
      email: validUser.email,
      userImage: validUser.userImage,
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    res.clearCookie("access_token");
    res.status(200).json({
      message: "User has been logged out successfully!",
    });
  } catch (error) {
    next(error);
  }
}

export const AuthController = {
  signup,
  login,
  logout,
};
