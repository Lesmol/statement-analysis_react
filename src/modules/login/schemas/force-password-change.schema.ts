import { z } from "zod"
import { ValidationUtils } from "@/utils/validation.utils.ts"

export const ForcePasswordChangeSchema = z
  .object({
    username: z.email("Enter a valid email").min(1, "Username is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .superRefine((values, ctx) => {
    if (!ValidationUtils.PASSWORD_REGEX.test(values.password)) {
      ctx.addIssue({
        code: "custom",
        message:
          "Password must include an uppercase letter, a lowercase letter, a number, and a special character",
        path: ["password"],
      })
    }

    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
    }
  })

export type ForcePasswordChangeSchema = z.infer<typeof ForcePasswordChangeSchema>