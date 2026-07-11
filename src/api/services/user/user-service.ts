import {HttpService, type ServiceResult} from "../HttpService"
import {UserResponseSchema} from "@/api/services/user/user-response-schema.ts";
import type {UserResponse} from "@/api/services/user/user-types.ts";

class UserService extends HttpService {
    async getUser(): Promise<ServiceResult<UserResponse>> {
        return this.get("/api/v1/user", UserResponseSchema)
    }
}

export const userService = new UserService()
