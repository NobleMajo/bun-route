import type { BodyInit } from "undici-types"
import type { Awaitable, CookieOptions } from "./types"

export const notFoundResponse = new Response(
    "Not Found",
    {
        status: 404,
        statusText: "Not Found",
    }
)

export class ResponseBuilder {
    submit: boolean = false
    statusCode: number = 200
    statusText?: string
    bodyInit: BodyInit = null
    headers: [string, string][] = []

    beforeSentHooks: ((res: ResponseBuilder) => Awaitable<void>)[] | undefined

    /**
     * Adds a hook that will be called before the response is build for sending
     * @param hook The hook to add
     * @returns The ResponseBuilder instance
     */
    beforeSent(
        hook: (res: ResponseBuilder) => Awaitable<void>
    ): ResponseBuilder {
        if (!this.beforeSentHooks) {
            this.beforeSentHooks = []
        }
        this.beforeSentHooks.push(hook)
        return this
    }

    /**
     * Starts the before sent hooks in order and waits for them all to finish
     * @param p The promise to wait for before starting the hooks
     */
    private async startBeforeSentHookAsync(p: Promise<void>) {
        await p

        let hook = this.beforeSentHooks?.shift()
        while (hook != undefined) {
            const p = hook(this)
            if (
                p &&
                p.then != undefined
            ) {
                await p
            }
        }
    }

    /**
     * Starts the before sent hooks in order and waits for them all to finish
     * @returns A promise that resolves when all the hooks have finished
     */
    startBeforeSentHook(): Awaitable<void> {
        if (this.beforeSentHooks) {
            let hook = this.beforeSentHooks.pop()
            while (hook != undefined) {
                const p = hook(this)
                if (
                    p &&
                    p.then != undefined
                ) {
                    return this.startBeforeSentHookAsync(p)
                }

                hook = this.beforeSentHooks.pop()
            }
        }
    }

    /**
     * Builds the bun response object
     * @returns The final response object
     */
    build(): Response {
        return new Response(
            this.bodyInit as any, //TODO: fix bun/node type errors
            {
                status: this.statusCode,
                statusText: this.statusText,
                headers: this.headers,
            }
        )
    }

    /**
     * Resets the response builder to its default state, clearing all options and properties.
     * @returns The response builder instance
     */
    reset(): ResponseBuilder {
        this.submit = false
        this.statusCode = 200
        this.statusText = undefined
        this.bodyInit = null
        this.headers = []
        return this
    }

    /**
     * Sets the status code and optional status text of the response.
     * @param statusCode The status code
     * @param statusText The status text, if provided
     * @returns The response builder instance
     */
    status(statusCode: number, statusText?: string): ResponseBuilder {
        this.statusCode = statusCode
        if (statusText) {
            this.statusText = statusText
        }
        return this
    }

    /**
     * Removes the given header from the response.
     * @param name The name of the header to remove
     * @returns The response builder instance
     */
    unsetHeader(name: string): ResponseBuilder {
        this.headers = this.headers.filter(
            (header) =>
                header[0].toLowerCase() !==
                name.toLowerCase()
        )
        return this
    }

    /**
     * Sets a header on the response.
     * @param name The name of the header to set
     * @param value The value of the header
     * @param overwrite Whether to overwrite any existing header with the same name. Default is true.
     * @returns The response builder instance
     */
    setHeader(
        name: string,
        value: string,
        overwrite: boolean = true,
    ): ResponseBuilder {
        if (overwrite) {
            this.unsetHeader(name)
        }

        this.headers.push([name, value])

        return this
    }

    /**
     * Sets a cookie on the response.
     * @param name The name of the cookie
     * @param value The value of the cookie
     * @param options The options for the cookie
     * @returns The response builder instance
     */
    setCookie(
        name: string,
        value: string,
        options: CookieOptions = {},
    ): ResponseBuilder {
        const cookieParts = [`${name}=${encodeURIComponent(value)}`]

        if (options.MaxAge) {
            cookieParts.push(`Max-Age=${options.MaxAge}`)
        }
        if (options.Path) {
            cookieParts.push(`Path=${options.Path}`)
        }
        if (options.HttpOnly) {
            cookieParts.push(`HttpOnly`)
        }
        if (options.Secure) {
            cookieParts.push(`Secure`)
        }
        if (options.SameSite) {
            cookieParts.push(`SameSite=${options.SameSite}`)
        }

        this.setHeader('Set-Cookie', cookieParts.join('; '), false)

        return this
    }

    /**
     * Unsets a cookie on the response.
     * @param name The name of the cookie to unset
     * @returns The response builder instance
     */
    unsetCookie(name: string): ResponseBuilder {
        this.setHeader('Set-Cookie', name + "=; Expires=Thu, 01 Jan 1970 00:00:00 GMT", false)
        return this
    }

    /**
     * Sets the body of the response.
     * @param bodyInit The body of the response
     * @returns The response builder instance
     */
    body(
        bodyInit: BodyInit = null,
    ): ResponseBuilder {
        this.bodyInit = bodyInit
        return this
    }

    /**
     * Submits the response to the client, with an optional body.
     * @param bodyInit The body of the response, if any
     */
    send(
        bodyInit: BodyInit = null,
    ): void {
        this.bodyInit = bodyInit
        this.submit = true
    }

    /**
     * Redirects to a given url. If perma is true, this is a 308 redirect, otherwise it is a 307.
     * @param url The url to redirect to
     * @param perma Whether this is a permanent redirect
     * @returns void because it is submitted to the client
     */
    sendRedirect(url: string, perma: boolean = false): void {
        this.reset()
        this.statusCode = perma ? 308 : 307
        this.headers.push(["location", url])
        this.submit = true
    }

    /**
     * Redirects to a given url with a custom status code.
     * @param url The url to redirect to
     * @param status The status code to use for the redirect
     * @returns void because it is submitted to the client
     */
    sendRedirectCustom(url: string, status: number): void {
        this.reset()
        this.statusCode = status
        this.headers.push(["location", url])
        this.submit = true
    }

    /**
     * Sets the status code to 401 and adds a basic auth `WWW-Authenticate` header.
     * @param realm The realm to use for the header. Default is "User Visible Realm".
     * @param charset The character set to use for the realm. Default is "UTF-8".
     * @returns void because it is submitted to the client
     */
    sendBasicAuth(
        bodyInit: BodyInit = null,
        realm: string = "User Visible Realm",
        charset: string = "UTF-8",
    ): void {
        this.reset()
        this.statusCode = 401
        this.setHeader(
            'WWW-Authenticate',
            'Basic realm="' + realm +
            '", charset="' + charset + '"'
        )
        this.bodyInit = bodyInit
        this.submit = true
    }
}