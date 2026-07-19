import { z } from "zod"
import {
  type LoginRequestSchema,
  ForcePasswordChangeSchema,
  SignUpRequestSchema,
} from "@/api/services/login/login-request-schema.ts"
import type { LoginResponseSchema } from "@/api/services/login/login-response-schema.ts"

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>

export type SignUpRequest = z.infer<typeof SignUpRequestSchema>
export type ForcePasswordChangeRequest = z.infer<typeof ForcePasswordChangeSchema>
