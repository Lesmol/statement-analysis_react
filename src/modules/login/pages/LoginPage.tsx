import {useState} from "react"
import {useAsyncAction} from "@/hooks/useAsyncAction.ts"
import {useForm} from "react-hook-form"
import {Field, FieldGroup, FieldLabel} from "@/components/ui/field.tsx"
import {Input} from "@/components/ui/input.tsx"
import {Button} from "@/components/ui/button.tsx"
import type {LoginRequest} from "@/api/services/login/login-types.ts";
import {useServices} from "@/hooks/useServices.ts";
import {useAuth} from "@/hooks/useAuth.ts";

interface LoginValues {
    username: string
    password: string
}

const LoginPage = () => {
    const {loginService} = useServices();
    const {login} = useAuth();
    const [credentials, setCredentials] = useState<LoginValues>({username: "", password: ""})
    const {register, handleSubmit, reset} = useForm<LoginValues>()

    const loginAction = useAsyncAction(async () => {
        console.log("Credentials: ", credentials)
        const request: LoginRequest = {
            username: credentials.username,
            password: credentials.password
        }

        const response = await loginService.login(request);

        if (response.status === "ok") {
            login(response.data.accessToken, response.data.expiresIn.toString())
        }
    })

    const onSubmit = (values: LoginValues) => {
        setCredentials(values)
        loginAction.execute()
    }

    return (
        <div className={"flex items-start justify-center min-h-screen pt-24"}>
            <div className={"w-200"}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="username">Username</FieldLabel>
                            <Input id="username" placeholder="Enter your username" {...register("username")} />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input id="password" type="password"
                                   placeholder="Enter your password" {...register("password")} />
                        </Field>
                        <Field orientation="horizontal">
                            <Button type="button" variant="outline" onClick={() => reset()}>Reset</Button>
                            <Button type="submit">Submit</Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}

export default LoginPage