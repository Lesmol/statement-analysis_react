import { z } from "zod"
import { isValidPhoneNumber } from "react-phone-number-input"

export const SignUpFormSchema = z
  .object({
    email: z.email("Enter a valid email address").min(1, "Email is required"),
    phoneNumber: z.string().min(1, "Phone number is required"),
  })
  .superRefine((values, ctx) => {
    if (!isValidPhoneNumber(values.phoneNumber)) {
      ctx.addIssue({
        code: "custom",
        message: "Enter a valid phone number",
        path: ["phoneNumber"],
      })
    }
  })

export type SignUpValues = z.infer<typeof SignUpFormSchema>
