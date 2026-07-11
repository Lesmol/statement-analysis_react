import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { useAsyncAction } from "@/hooks/useAsyncAction.ts"
import type { LoginRequest } from "@/api/services/login/login-types.ts"
import { useServices } from "@/hooks/useServices.ts"
import { useAuth } from "@/hooks/useAuth.ts"
import { useDashboard } from "@/modules/dashboard/hooks/useDashboard.ts"
import { ROUTES } from "@/routes.ts"

interface LoginValues {
  username: string
  password: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { loginService } = useServices()
  const { login } = useAuth()
  const {
    setUsername,
    hasAccountWithReport,
    getFirstReportAccountId,
    setSelectedAccountId,
  } = useDashboard()
  const { register, handleSubmit, reset } = useForm<LoginValues>()

  const [errorMessage, setErrorMessage] = useState("")

  const loginAction = useAsyncAction(async (values: LoginValues) => {
    setErrorMessage("")

    const request: LoginRequest = {
      username: values.username,
      password: values.password,
    }

    const response = await loginService.login(request)

    if (response.status === "ok") {
      login(response.data.gatewayToken, response.data.expiresIn.toString())
      setUsername(values.username)

      if (hasAccountWithReport()) {
        const reportAccountId = getFirstReportAccountId()
        if (reportAccountId) setSelectedAccountId(reportAccountId)
        navigate(ROUTES.DASHBOARD, { replace: true })
      } else {
        navigate(ROUTES.UPLOAD, { replace: true })
      }
    } else {
      setErrorMessage(
        response.data.description || response.data.message || "Login failed"
      )
    }
  })

  const onSubmit = (values: LoginValues) => {
    loginAction.execute(values).catch(() => {
      setErrorMessage(
        "Unable to connect. Please check your network and try again."
      )
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div
        className="w-[400px] max-w-full"
        style={{ animation: "fade-up 0.4s ease" }}
      >
        <div className="mb-8 text-center text-[13.5px] text-muted-foreground">
          Sign in to review your financial reports
        </div>

        <div className="rounded-[14px] border border-border bg-card p-7 shadow-[0_1px_2px_oklch(0_0_0/0.04)]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  disabled={loginAction.isPending}
                  {...register("username")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  disabled={loginAction.isPending}
                  {...register("password")}
                />
              </Field>

              {errorMessage && (
                <div className="rounded-lg bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive">
                  {errorMessage}
                </div>
              )}

              <Field orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  className="h-[38px] flex-1 rounded-[10px]"
                  disabled={loginAction.isPending}
                  onClick={() => {
                    reset()
                    setErrorMessage("")
                  }}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="h-[38px] flex-1 rounded-[10px]"
                  disabled={loginAction.isPending}
                >
                  {loginAction.isPending ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border-2 border-white/30"
                        style={{
                          borderTopColor: "white",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Signing in…
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>

        <div className="mt-5 text-center text-[12.5px] text-[oklch(0.6_0_0)]">
          Prototype — any credentials will work
        </div>
      </div>
    </div>
  )
}

export default LoginPage
