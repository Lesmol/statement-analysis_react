import {z} from "zod";
import type {UserResponseSchema} from "@/api/services/user/user-response-schema.ts";

export type UserResponse = z.infer<typeof UserResponseSchema>