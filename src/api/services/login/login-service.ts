import { HttpService, type ServiceResult } from "../HttpService"
import type {
  LoginRequest,
  LoginResponse,
  ForcePasswordChangeRequest,
  SignUpRequest,
} from "@/api/services/login/login-types.ts"
import { LoginRequestSchema } from "@/api/services/login/login-request-schema.ts"
import { LoginResponseSchema } from "@/api/services/login/login-response-schema.ts"
import { LOGIN_ENDPOINTS } from "@/api/services/login/login-endpoints.ts"
import { ENDPOINTS } from "@/api/api-paths.ts"

class LoginService extends HttpService {
  private basePath = ENDPOINTS.AUTH

  async login(request: LoginRequest): Promise<ServiceResult<LoginResponse>> {
    const body = LoginRequestSchema.parse(request)
    return this.post(
      this.path(LOGIN_ENDPOINTS.LOGIN),
      body,
      LoginResponseSchema
    )
  }

  async logout(): Promise<ServiceResult> {
    return this.post(this.path(LOGIN_ENDPOINTS.LOGOUT))
  }

  async signUp(request: SignUpRequest) {
    return this.post(this.path(LOGIN_ENDPOINTS.SIGN_UP), request)
  }

  async forcePasswordChange(request: ForcePasswordChangeRequest) {
    return this.post(this.path(LOGIN_ENDPOINTS.FORCE_PASSWORD_CHANGE), request)
  }

  path(endpoint: string) {
    return `${this.basePath}/${endpoint}`
  }
}

export const loginService = new LoginService()
