import { type Server, type SocketAddress } from "bun"
import type { Request as BunRequest } from "undici-types"
import { type HttpMethod } from "./method"
import type { ResponseBuilder } from "./responseBuilder"
import { SplitPath } from "./router"

export type Awaitable<T> = T | Promise<T>


export type Request = BunRequest & {
    /**
     * `req.pathParams` is the path parameters of the request.
     * If a wildcard is used in the endpoint route,
     * then it is available in a `Router` handled request.
     */
    pathParams?: string[],
    /**
     * `req.httpMethod` is the HttpMethod enum value of the reuqest method used for routing.
     * It is always available in a `Router` handled request.
     */
    httpMethod: HttpMethod,
    /**
     * `req.path` is the path of the request.
     * It is always available in a `Router` handled request.
     */
    path: string,
    /**
     * `req.splitPath` is the splitted path of the request used for routing.
     * It is always available in a `Router` handled request.
     */
    splitPath: SplitPath,
    /**
     * `req.server` is the server that is handling the request.
     * It is always available in a `Router` handled request.
     */
    server: Server,
    /**
     * `req.sock` is the socket address of the request.
     * It is always available in a `Router` handled request.
     */
    sock: SocketAddress,
    /**
     * `req.originCookies` is not to use in your code.
     * It holds the origin cookies state of the request.
     */
    originCookies: unknown,
    /**
     * `req.cookies` is a key value map of all the cookies in the request if parsed earlier.
     * Gets loaded via the `Router.storeCookies(req, res)` function.
     */
    cookies: {
        [key: string]: string | undefined,
    },
    /**
     * `req.rid` is set to true if the request has been upgraded to a websocket.
     */
    upgraded?: true
}

export type BunRequestHandler = (request: Request, server: Server) => Awaitable<Response>

export type RequestMiddleware = (req: Request, res: ResponseBuilder) => Awaitable<void>

export type MergedRequestMiddleware = RequestMiddleware & {
    base: RequestMiddleware[],
}

export interface EndpointRoute {
    handler: RequestMiddleware,
    method: HttpMethod,
    splitPath: SplitPath,
}

export interface CookieOptions {
    MaxAge?: number
    Path?: string
    HttpOnly?: boolean
    Secure?: boolean
    SameSite?: 'Strict' | 'Lax' | 'None'
}