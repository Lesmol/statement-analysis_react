import {HttpService, type ServiceResult} from "../HttpService"
import type {LoginRequest, LoginResponse} from "@/api/services/login/login-types.ts";
import {LoginRequestSchema} from "@/api/services/login/login-request-schema.ts";
import {LoginResponseSchema} from "@/api/services/login/login-response-schema.ts";
import {LOGIN_ENDPOINTS} from "@/api/services/login/login-endpoints.ts";
import {ENDPOINTS} from "@/api/api-paths.ts";

class LoginService extends HttpService {
    private basePath = ENDPOINTS.AUTH

    async login(request: LoginRequest): Promise<ServiceResult<LoginResponse>> {
        const body = LoginRequestSchema.parse(request)
        return this.post(`${this.basePath}${LOGIN_ENDPOINTS.LOGIN}`, body, LoginResponseSchema)
    }

    async logout(): Promise<ServiceResult> {
        return this.post(`${this.basePath}${LOGIN_ENDPOINTS.LOGOUT}`)
    }
}

export const loginService = new LoginService()
