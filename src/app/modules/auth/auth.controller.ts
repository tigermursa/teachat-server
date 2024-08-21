import { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthService } from "./auth.services";
import { TUser } from "../user/user.interface";
import { CustomError } from "../../errors/CustomError";

// the signup api
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
      process.env.JWT_SECRET as string
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
      throw new CustomError("User not found", 404);
    }

    // Check if the password matches
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      throw new CustomError("Wrong credentials", 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET as string
    );

    // Set HTTP-only, Secure, and SameSite cookie
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set 'secure' in production
        sameSite: "lax", // Controls sending of cookies with cross-site requests
      })
      .status(200)
      .json({
        message: "User logged in successfully!",
        _id: validUser._id,
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
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Clear 'secure' cookie in production
      sameSite: "lax",
    });
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
