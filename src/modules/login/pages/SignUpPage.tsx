import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Button } from "@/components/ui/button.tsx"
import { PhoneInput } from "@/components/reui/phone-input.tsx"
import { ROUTES } from "@/routes.ts"
import {
  SignUpFormSchema,
  type SignUpValues,
} from "@/modules/login/schemas/sign-up.schema.ts"
import { useAsyncAction } from "@/hooks/useAsyncAction.ts"
import type { SignUpRequest } from "@/api/services/login/login-types.ts"
import { useServices } from "@/hooks/useServices.ts"

const SignUpPage = () => {
  const navigate = useNavigate()

  const { loginService } = useServices()

  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<SignUpValues>()

  const signUpAction = useAsyncAction(async (values: SignUpValues) => {
    const request: SignUpRequest = {
      email: values.email,
      phoneNumber: values.phoneNumber,
    }

    const response = await loginService.signUp(request)

    if (response.status === "error") {
      setErrorMessage(response.data.description || "Sign up failed")
      return
    }

    navigate(ROUTES.LOGIN, { replace: true, state: { temporaryPasswordFlow: true } })
  })

  const onSubmit = async (values: SignUpValues) => {
    const result = SignUpFormSchema.safeParse(values)

    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof SignUpValues
        setError(field, { type: "manual", message: issue.message })
      }
      return
    }

    await signUpAction.execute(values).catch(() => {
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
          Create an account - we'll email you a temporary password
        </div>

        <div className="rounded-[14px] border border-border bg-card p-7 shadow-[0_1px_2px_oklch(0_0_0/0.04)]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={signUpAction.isPending}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.phoneNumber}>
                <FieldLabel htmlFor="phone-number">Phone number</FieldLabel>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      id="phone-number"
                      placeholder="Enter your phone number"
                      disabled={signUpAction.isPending}
                      aria-invalid={!!errors.phoneNumber}
                      defaultCountry="ZA"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <FieldError errors={[errors.phoneNumber]} />
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
                  disabled={signUpAction.isPending}
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Back to login
                </Button>
                <Button
                  type="submit"
                  className="h-[38px] flex-1 rounded-[10px]"
                  disabled={signUpAction.isPending}
                >
                  {signUpAction.isPending ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="h-4 w-4 rounded-full border-2 border-white/30"
                        style={{
                          borderTopColor: "white",
                          animation: "spin 0.8s linear infinite",
                        }}
                      />
                      Creating account…
                    </div>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
