import { ZodError } from "zod";

export function handleZodErrorMessage(error: ZodError): string {
  return error.errors.map((error) => error.message).join(", ");
}
