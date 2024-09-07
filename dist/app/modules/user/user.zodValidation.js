"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.userValidationSchema = void 0;
const zod_1 = require("zod");
// Zod schema for validating the User model
exports.userValidationSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required"),
    userImage: zod_1.z.string().url("Invalid URL").nullable().optional(),
    email: zod_1.z.string().email("Invalid email address"),
    location: zod_1.z.string().min(1, "Location is required"),
    gender: zod_1.z.enum(["Male", "Female", "Other"], {
        errorMap: () => ({
            message: "Gender must be 'Male', 'Female', or 'Other'",
        }),
    }),
    age: zod_1.z.number().int().positive("Age must be a positive number"),
    work: zod_1.z.string().min(1, "Work field is required"),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    friendRequests: zod_1.z
        .array(zod_1.z.string().regex(/^[a-f\d]{24}$/i, "Invalid friend request ID"))
        .optional(),
    friends: zod_1.z
        .array(zod_1.z.string().regex(/^[a-f\d]{24}$/i, "Invalid friend ID"))
        .optional(),
    sentFriendRequests: zod_1.z
        .array(zod_1.z.string().regex(/^[a-f\d]{24}$/i, "Invalid sent request ID"))
        .optional(),
});
// Function to validate user data
const validateUser = (userData) => {
    return exports.userValidationSchema.safeParse(userData);
};
exports.validateUser = validateUser;
