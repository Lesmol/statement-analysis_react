import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group.tsx"
import { ROUTES } from "@/routes.ts"
import {
  ForcePasswordChangeSchema,
  type ForcePasswordChangeSchema as ForcePasswordChangeValues,
} from "@/modules/login/schemas/force-password-change.schema.ts"
import { useAsyncAction } from "@/hooks/useAsyncAction.ts"
import type { ForcePasswordChangeRequest } from "@/api/services/login/login-types.ts"
import { useServices } from "@/hooks/useServices.ts"

interface ForcePasswordChangeLocationState {
  username?: string
  session?: string
}

const ForcePasswordChangePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { username: defaultUsername, session } =
    (location.state as ForcePasswordChangeLocationState) || {}
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false)

  const { loginService } = useServices()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ForcePasswordChangeValues>({
    defaultValues: { username: defaultUsername },
  })

  const setPasswordAction = useAsyncAction(
    async (values: ForcePasswordChangeValues) => {
      const request: ForcePasswordChangeRequest = {
        username: values.username,
        newPassword: values.password,
        session: session || "",
      }

      const response = await loginService.forcePasswordChange(request)

      if (response.status === "error") {
        // Do something
        return
      }

      navigate(ROUTES.LOGIN, { replace: true })
    }
  )

  const onSubmit = async (values: ForcePasswordChangeSchema) => {
    const result = ForcePasswordChangeSchema.safeParse(values)

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ForcePasswordChangeSchema
        setError(field, { type: "manual", message: issue.message })
      }
      return
    }

    await setPasswordAction.execute(values)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div
        className="w-[400px] max-w-full"
        style={{ animation: "fade-up 0.4s ease" }}
      >
        <div className="mb-8 text-center text-[13.5px] text-muted-foreground">
          Enter the temporary password sent to your email and choose a new
          password
        </div>

        <div className="rounded-[14px] border border-border bg-card p-7 shadow-[0_1px_2px_oklch(0_0_0/0.04)]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.username}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  disabled
                  aria-invalid={!!errors.username}
                  {...register("username")}
                />
                <FieldError errors={[errors.username]} />
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">New password</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Enter your new password"
                    disabled={setPasswordAction.isPending}
                    aria-invalid={!!errors.password}
                    {...register("password")}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      aria-label={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                    >
                      {isPasswordVisible ? <IconEyeOff /> : <IconEye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={[errors.password]} />
              </Field>

              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="confirm-password">
                  Confirm password
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="confirm-password"
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    placeholder="Confirm your new password"
                    disabled={setPasswordAction.isPending}
                    aria-invalid={!!errors.confirmPassword}
                    {...register("confirmPassword")}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      type="button"
                      aria-label={
                        isConfirmPasswordVisible
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setIsConfirmPasswordVisible((prev) => !prev)
                      }
                    >
                      {isConfirmPasswordVisible ? <IconEyeOff /> : <IconEye />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                <FieldError errors={[errors.confirmPassword]} />
              </Field>

              <Field orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  className="h-[38px] flex-1 rounded-[10px]"
                  disabled={setPasswordAction.isPending}
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Back to sign in
                </Button>
                <Button
                  type="submit"
                  className="h-[38px] flex-1 rounded-[10px]"
                  disabled={setPasswordAction.isPending}
                >
                  {setPasswordAction.isPending ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border-2 border-white/30"
                        style={{
                          borderTopColor: "white",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Setting password…
                    </div>
                  ) : (
                    "Set password"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>

        <div className="mt-5 text-center text-[12.5px] text-[oklch(0.6_0_0)]">
          Prototype — any details will work
        </div>
      </div>
    </div>
  )
}

export default ForcePasswordChangePage
