import { Request, Response, NextFunction } from "express";

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
