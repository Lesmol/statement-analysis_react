import {z} from "zod";

export const LoginResponseSchema = z.object({
    accessToken: z.string(),
    gatewayToken: z.string(),
    expiresIn: z.number(),
})