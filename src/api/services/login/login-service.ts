import {HttpService, type ServiceResult} from "../HttpService"
import type {LoginRequest, LoginResponse} from "@/api/services/login/login-types.ts";
import {LoginRequestSchema} from "@/api/services/login/login-request-schema.ts";
import {LoginResponseSchema} from "@/api/services/login/login-response-schema.ts";
import {LOGIN_ENDPOINTS} from "@/api/services/login/login-endpoints.ts";

class LoginService extends HttpService {
    private baseUrl = "https://iritpjoyg7.execute-api.af-south-1.amazonaws.com/api/v1/auth"

    async login(request: LoginRequest): Promise<ServiceResult<LoginResponse>> {
        const body = LoginRequestSchema.parse(request)
        return this.post(`${this.baseUrl}${LOGIN_ENDPOINTS.LOGIN}`, body, LoginResponseSchema)
    }

    async logout(): Promise<ServiceResult> {
        return this.post(`${this.baseUrl}${LOGIN_ENDPOINTS.LOGOUT}`)
    }
}

export const loginService = new LoginService()