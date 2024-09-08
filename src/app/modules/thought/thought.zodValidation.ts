import { z } from "zod";

export const thoughtValidationSchema = z.object({
  text: z
    .string()
    .min(1, "Text is required")
    .max(70, "Text cannot exceed 70 characters"),
  name: z.string().min(1, "Name is required"),
  userId: z.string().min(1, "User ID is required"),
  createdAt: z.date().optional(),
});

// Function to validate thought data
export const validateThought = (thoughtData: unknown) => {
  return thoughtValidationSchema.safeParse(thoughtData);
};
