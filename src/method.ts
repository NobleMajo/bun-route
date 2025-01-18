export type HttpMethodString = "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE" | "PATCH"

export enum HttpMethod {
    ALL = 1,
    GET,
    PUT,
    POST,
    PATCH,
    DELETE,
    HEAD,
    OPTIONS,
    TRACE,
    CONNECT,
    UNKNOWN,
}

export function parseHttpMethods(method: string): HttpMethod {
    switch (method) {
        case "*":
            return HttpMethod.ALL
        case "GET":
            return HttpMethod.GET
        case "PUT":
            return HttpMethod.PUT
        case "POST":
            return HttpMethod.POST
        case "PATCH":
            return HttpMethod.PATCH
        case "DELETE":
            return HttpMethod.DELETE
        case "HEAD":
            return HttpMethod.HEAD
        case "OPTIONS":
            return HttpMethod.OPTIONS
        case "TRACE":
            return HttpMethod.TRACE
        case "CONNECT":
            return HttpMethod.CONNECT
        default:
            return HttpMethod.UNKNOWN
    }
}

export function stringifyHttpMethods(method: HttpMethod | undefined): string {
    switch (method) {
        case HttpMethod.ALL:
            return "ALL"
        case HttpMethod.GET:
            return "GET"
        case HttpMethod.PUT:
            return "PUT"
        case HttpMethod.POST:
            return "POST"
        case HttpMethod.PATCH:
            return "PATCH"
        case HttpMethod.DELETE:
            return "DELETE"
        case HttpMethod.HEAD:
            return "HEAD"
        case HttpMethod.OPTIONS:
            return "OPTIONS"
        case HttpMethod.TRACE:
            return "TRACE"
        case HttpMethod.CONNECT:
            return "CONNECT"
        case undefined:
            return "ALL"
        default:
            return "UNKNOWN"
    }
}