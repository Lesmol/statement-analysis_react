import {type ReactNode, useCallback, useMemo, useState} from "react";
import {AuthContext} from "@/context/auth-context-types.ts";

function isTokenValid(): boolean {
    const accessToken = localStorage.getItem("accessToken")
    const expiresIn = localStorage.getItem("expiresIn")

    if (!accessToken || !expiresIn) return false

    const loginTime = localStorage.getItem("loginTime")
    if (!loginTime) return false

    const elapsed = (Date.now() - Number(loginTime)) / 1000
    return elapsed < Number(expiresIn)
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isTokenValid)

    const login = useCallback((accessToken: string, expiresIn: string) => {
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("expiresIn", expiresIn)
        localStorage.setItem("loginTime", Date.now().toString())
        setIsAuthenticated(true)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("expiresIn")
        localStorage.removeItem("loginTime")
        setIsAuthenticated(false)
    }, [])

    const value = useMemo(
        () => ({ isAuthenticated, login, logout }),
        [isAuthenticated, login, logout]
    )

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
