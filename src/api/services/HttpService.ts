import {ZodType} from "zod"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface ErrorResponse {
    message: string
    description: string
}

export type ServiceResult<T = void> =
    | { status: "ok"; data: T }
    | { status: "error"; data: ErrorResponse }

export class HttpService {
    private httpClient = {
        request: async <TBody>(
            method: HttpMethod,
            url: string,
            body?: TBody
        ): Promise<Response> => {
            return fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "Correlation-id": crypto.randomUUID()
                },
                body: body !== undefined ? JSON.stringify(body) : undefined,
            })
        },
    }

    private ok<T>(data: T): ServiceResult<T> {
        return { status: "ok", data }
    }

    private error(message: string, description: string): ServiceResult<never> {
        return { status: "error", data: { message, description } }
    }

    protected async get(endpoint: string): Promise<ServiceResult>

    protected async get<TResponse>(
        endpoint: string,
        schema: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse>>
    protected async get<TResponse>(
        endpoint: string,
        schema?: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const response = await this.httpClient.request("GET", endpoint)

            if (!schema) return this.ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return this.error("Validation Error", result.error.message)

            return this.ok(result.data)
        } catch (e) {
            console.error(e instanceof Error ? e.stack : e)
            return this.error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }

    protected async post<TBody>(endpoint: string, body?: TBody): Promise<ServiceResult>

    protected async post<TBody, TResponse>(
        endpoint: string,
        body: TBody,
        schema: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse>>
    protected async post<TBody, TResponse>(
        endpoint: string,
        body?: TBody,
        schema?: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const response = await this.httpClient.request("POST", endpoint, body)

            if (!schema) return this.ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return this.error("Validation Error", result.error.message)

            return this.ok(result.data)
        } catch (e) {
            console.error(e instanceof Error ? e.stack : e)
            return this.error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }

    protected async put<TBody>(endpoint: string, body?: TBody): Promise<ServiceResult>

    protected async put<TBody, TResponse>(
        endpoint: string,
        body: TBody,
        schema: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse>>
    protected async put<TBody, TResponse>(
        endpoint: string,
        body?: TBody,
        schema?: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const response = await this.httpClient.request("PUT", endpoint, body)

            if (!schema) return this.ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return this.error("Validation Error", result.error.message)

            return this.ok(result.data)
        } catch (e) {
            console.error(e instanceof Error ? e.stack : e)
            return this.error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }

    protected async patch<TBody>(endpoint: string, body?: TBody): Promise<ServiceResult>

    protected async patch<TBody, TResponse>(
        endpoint: string,
        body: TBody,
        schema: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse>>
    protected async patch<TBody, TResponse>(
        endpoint: string,
        body?: TBody,
        schema?: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const response = await this.httpClient.request("PATCH", endpoint, body)

            if (!schema) return this.ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return this.error("Validation Error", result.error.message)

            return this.ok(result.data)
        } catch (e) {
            console.error(e instanceof Error ? e.stack : e)
            return this.error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }

    protected async delete(endpoint: string): Promise<ServiceResult>

    protected async delete<TResponse>(
        endpoint: string,
        schema: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse>>
    protected async delete<TResponse>(
        endpoint: string,
        schema?: ZodType<TResponse>
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const response = await this.httpClient.request("DELETE", endpoint)

            if (!schema) return this.ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return this.error("Validation Error", result.error.message)

            return this.ok(result.data)
        } catch (e) {
            console.error(e instanceof Error ? e.stack : e)
            return this.error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }
}