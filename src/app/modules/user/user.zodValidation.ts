import { z } from "zod";

// Zod schema for validating the User model
export const userValidationSchema = z.object({
  username: z.string().min(1, "Username is required"),
  userImage: z.string().url("Invalid URL").nullable().optional(),
  email: z.string().email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    errorMap: () => ({
      message: "Gender must be 'Male', 'Female', or 'Other'",
    }),
  }),
  age: z.number().int().positive("Age must be a positive number"),
  work: z.string().min(1, "Work field is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  friendRequests: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid friend request ID"))
    .optional(),
  friends: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid friend ID"))
    .optional(),
  sentFriendRequests: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid sent request ID"))
    .optional(),
});

// Function to validate user data
export const validateUser = (userData: unknown) => {
  return userValidationSchema.safeParse(userData);
};
