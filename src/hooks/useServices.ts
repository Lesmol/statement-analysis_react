import { loginService } from "@/api/services/login/login-service.ts"

export function useServices() {
    return {
        loginService,
    }
}