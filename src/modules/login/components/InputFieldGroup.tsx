import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button.tsx"
import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field.tsx"
import { Input } from "@/components/ui/input.tsx"

interface InputField {
    id: string
    label: string
    type?: string
    placeholder?: string
}

interface InputFieldGroupProps {
    fields: InputField[]
    onSubmit?: (values: Record<string, string>) => void
}

export function InputFieldgroup({ fields, onSubmit }: InputFieldGroupProps) {
    const { register, handleSubmit, reset } = useForm<Record<string, string>>()

    return (
        <form onSubmit={handleSubmit((values) => onSubmit?.(values))}>
            <FieldGroup>
                {fields.map(({ id, label, type = "text", placeholder }) => (
                    <Field key={id}>
                        <FieldLabel htmlFor={id}>{label}</FieldLabel>
                        <Input id={id} type={type} placeholder={placeholder} {...register(id)} />
                    </Field>
                ))}
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={() => reset()}>Reset</Button>
                    <Button type="submit">Submit</Button>
                </Field>
            </FieldGroup>
        </form>
    )
}