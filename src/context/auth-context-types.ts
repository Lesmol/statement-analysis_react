import {createContext} from "react";

export type AuthContextState = {
    isAuthenticated: boolean
    login: (accessToken: string, expiresIn: string) => void
    logout: () => void
}

export const AuthContext = createContext<AuthContextState | undefined>(undefined)