import {z} from "zod";

export const LoginResponseSchema = z.object({
    accessToken: z.string(),
    expiresIn: z.number(),
})