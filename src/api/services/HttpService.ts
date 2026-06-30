import { ZodType } from "zod"

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

interface RequestOptions {
    headers?: Record<string, string>
}

interface RequestWithBodyOptions<TBody> extends RequestOptions {
    body?: TBody
}

export interface ErrorResponse {
    message: string
    description: string
}

export type ServiceResult<T = void> =
    | { status: "ok"; data: T }
    | { status: "error"; data: ErrorResponse }

function ok<T>(data: T): ServiceResult<T> {
    return { status: "ok", data }
}

function error(message: string, description: string): ServiceResult<never> {
    return { status: "error", data: { message, description } }
}

export class HttpService {
    private httpClient = {
        request: async <TBody>(
            method: HttpMethod,
            url: string,
            options: RequestWithBodyOptions<TBody> = {}
        ): Promise<Response> => {
            return fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...options.headers,
                },
                body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
            })
        },
    }

    // GET — no response body
    protected async get(endpoint: string, options?: RequestOptions): Promise<ServiceResult>
    // GET — with response body
    protected async get<TResponse>(
        endpoint: string,
        schema: ZodType<TResponse>,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse>>
    protected async get<TResponse>(
        endpoint: string,
        schemaOrOptions?: ZodType<TResponse> | RequestOptions,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const schema = schemaOrOptions instanceof ZodType ? schemaOrOptions : undefined
            const opts = schemaOrOptions instanceof ZodType ? options : (schemaOrOptions as RequestOptions)

            const response = await this.httpClient.request("GET", endpoint, opts)

            if (!schema) return ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return error("Validation Error", result.error.message)

            return ok(result.data)
        } catch (e) {
            return error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }

    // POST — no response body
    protected async post<TBody>(endpoint: string, body?: TBody, options?: RequestOptions): Promise<ServiceResult>
    // POST — with response body
    protected async post<TBody, TResponse>(
        endpoint: string,
        body: TBody,
        schema: ZodType<TResponse>,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse>>
    protected async post<TBody, TResponse>(
        endpoint: string,
        body?: TBody,
        schemaOrOptions?: ZodType<TResponse> | RequestOptions,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const schema = schemaOrOptions instanceof ZodType ? schemaOrOptions : undefined
            const opts = schemaOrOptions instanceof ZodType ? options : (schemaOrOptions as RequestOptions)

            const response = await this.httpClient.request("POST", endpoint, { body, ...opts })

            if (!schema) return ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return error("Validation Error", result.error.message)

            return ok(result.data)
        } catch (e) {
            return error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }

    // PUT — no response body
    protected async put<TBody>(endpoint: string, body?: TBody, options?: RequestOptions): Promise<ServiceResult>
    // PUT — with response body
    protected async put<TBody, TResponse>(
        endpoint: string,
        body: TBody,
        schema: ZodType<TResponse>,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse>>
    protected async put<TBody, TResponse>(
        endpoint: string,
        body?: TBody,
        schemaOrOptions?: ZodType<TResponse> | RequestOptions,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const schema = schemaOrOptions instanceof ZodType ? schemaOrOptions : undefined
            const opts = schemaOrOptions instanceof ZodType ? options : (schemaOrOptions as RequestOptions)

            const response = await this.httpClient.request("PUT", endpoint, { body, ...opts })

            if (!schema) return ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return error("Validation Error", result.error.message)

            return ok(result.data)
        } catch (e) {
            return error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }

    // PATCH — no response body
    protected async patch<TBody>(endpoint: string, body?: TBody, options?: RequestOptions): Promise<ServiceResult>
    // PATCH — with response body
    protected async patch<TBody, TResponse>(
        endpoint: string,
        body: TBody,
        schema: ZodType<TResponse>,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse>>
    protected async patch<TBody, TResponse>(
        endpoint: string,
        body?: TBody,
        schemaOrOptions?: ZodType<TResponse> | RequestOptions,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const schema = schemaOrOptions instanceof ZodType ? schemaOrOptions : undefined
            const opts = schemaOrOptions instanceof ZodType ? options : (schemaOrOptions as RequestOptions)

            const response = await this.httpClient.request("PATCH", endpoint, { body, ...opts })

            if (!schema) return ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return error("Validation Error", result.error.message)

            return ok(result.data)
        } catch (e) {
            return error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }

    // DELETE — no response body
    protected async delete(endpoint: string, options?: RequestOptions): Promise<ServiceResult>
    // DELETE — with response body
    protected async delete<TResponse>(
        endpoint: string,
        schema: ZodType<TResponse>,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse>>
    protected async delete<TResponse>(
        endpoint: string,
        schemaOrOptions?: ZodType<TResponse> | RequestOptions,
        options?: RequestOptions
    ): Promise<ServiceResult<TResponse | void>> {
        try {
            const schema = schemaOrOptions instanceof ZodType ? schemaOrOptions : undefined
            const opts = schemaOrOptions instanceof ZodType ? options : (schemaOrOptions as RequestOptions)

            const response = await this.httpClient.request("DELETE", endpoint, opts)

            if (!schema) return ok(undefined)

            const result = schema.safeParse(await response.json())
            if (!result.success) return error("Validation Error", result.error.message)

            return ok(result.data)
        } catch (e) {
            return error("Request Failed", e instanceof Error ? e.message : "An unexpected error occurred")
        }
    }
}
