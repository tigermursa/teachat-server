import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";

// Extend the Request interface to include the user property
interface CustomRequest extends Request {
  user?: any;
}

export function verifyToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies.access_token;

  if (!token) {
    return next(new CustomError("Access denied. No token provided.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = decoded; // Attach the decoded token (user info) to the request
    next();
  } catch (ex) {
    next(new CustomError("Invalid token.", 400));
  }
}
