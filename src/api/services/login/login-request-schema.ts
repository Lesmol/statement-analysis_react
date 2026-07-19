import { z } from "zod"

export const LoginRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
})

export const SignUpRequestSchema = z.object({
  email: z.string(),
  phoneNumber: z.string(),
})

export const ForcePasswordChangeSchema = z.object({
  username: z.string(),
  newPassword: z.string(),
  session: z.string(),
})
