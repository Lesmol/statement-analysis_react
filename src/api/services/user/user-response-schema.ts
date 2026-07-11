import {z} from "zod";

export const UserResponseSchema = z.object({
    username: z.string(),
    email: z.string(),
    phone: z.string(),
})