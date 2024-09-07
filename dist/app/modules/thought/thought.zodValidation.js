"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateThought = exports.thoughtValidationSchema = void 0;
const zod_1 = require("zod");
exports.thoughtValidationSchema = zod_1.z.object({
    text: zod_1.z
        .string()
        .min(1, "Text is required")
        .max(30, "Text cannot exceed 30 characters"),
    name: zod_1.z.string().min(1, "Name is required"),
    userId: zod_1.z.string().min(1, "User ID is required"),
    createdAt: zod_1.z.date().optional(),
});
// Function to validate thought data
const validateThought = (thoughtData) => {
    return exports.thoughtValidationSchema.safeParse(thoughtData);
};
exports.validateThought = validateThought;
