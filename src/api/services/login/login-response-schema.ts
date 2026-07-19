import {z} from "zod";

export const LoginResponseSchema = z.object({
  accessToken: z.string().optional(),
  idToken: z.string().optional(),
  expiresIn: z.number().optional(),
  session: z.string().optional(),
  requiresPasswordChange: z.boolean().optional(),
})