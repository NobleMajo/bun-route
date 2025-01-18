import type { ResponseBuilder } from "./responseBuilder"
import type { EndpointRoute, MergedRequestMiddleware, Request, RequestMiddleware } from "./types"



/**
 * Unmerge multiple request middlewares into individual ones.
 * @param middlewares The middlewares to unmerge.
 * @returns An array of individual request middlewares.
 */
export function unmergeRequestMiddleware(
    ...middlewares: RequestMiddleware[]
): RequestMiddleware[] {
    const foundMiddlewares: RequestMiddleware[] = []

    for (const middleware of middlewares) {
        if (isMergedRequestMiddleware(middleware)) {
            foundMiddlewares.push(
                ...unmergeRequestMiddleware(
                    ...middleware.base
                )
            )
        } else {
            foundMiddlewares.push(middleware)
        }

    }

    return foundMiddlewares
}


/**
 * Merge multiple request middlewares into a single one.
 * @param middlewares The middlewares to merge.
 * @returns A single middleware that calls all the given middlewares in order.
 *          If any of the middlewares returns a promise, its handles the rest middlewars async.
 */
export function mergeRequestMiddlewares(
    ...middlewares: RequestMiddleware[]
): MergedRequestMiddleware | RequestMiddleware {
    if (middlewares.length == 0) {
        throw new Error("no middlewares specified")
    } else if (middlewares.length == 1) {
        return middlewares[0]
    }

    middlewares = unmergeRequestMiddleware(...middlewares)

    const mergedAsync = async (
        initialDefIndex: number,
        promise: Promise<void>,
        req: Request,
        res: ResponseBuilder,
    ) => {
        await promise

        if (
            res.submit === true ||
            req.upgraded === true
        ) {
            return
        }

        for (let i = initialDefIndex + 1; i < middlewares.length; i++) {
            const middleware = middlewares[i]
            const p = middleware(req, res)
            if (
                p &&
                p.then != undefined
            ) {
                await p
            }

            if (
                (res.submit as boolean) === true ||
                req.upgraded === true
            ) {
                return
            }
        }
    }

    const baseMerged: RequestMiddleware = (req, res) => {
        for (let i = 0; i < middlewares.length; i++) {
            const middleware = middlewares[i]
            const p = middleware(req, res)
            if (
                p &&
                p.then != undefined
            ) {
                return mergedAsync(i, p, req, res)
            }

            if (
                res.submit === true ||
                req.upgraded === true
            ) {
                return
            }
        }
    }

    const merged = baseMerged as unknown as MergedRequestMiddleware
    merged.base = middlewares
    return merged
}

/**
 * Checks if the given middleware is a merged middleware.
 * Merged middlewares are created by {@link mergeRequestMiddlewares}.
 * They contain an array of middlewares in the `base` property.
 * This function checks if the `base` property is an array and
 * returns true if it is, false otherwise.
 * @param middleware The middleware to check.
 * @returns True if the middleware is a merged middleware, false otherwise.
 */
export function isMergedRequestMiddleware(
    middleware: RequestMiddleware
): middleware is MergedRequestMiddleware {
    return Array.isArray(
        (
            middleware as unknown as MergedRequestMiddleware
        ).base
    )
}

/**
 * Checks if two endpoint routes are mergeable.
 * The routes are mergeable if they have the same method and path.
 * The path is considered the same if the splitPath property is undefined for both routes or
 * if the splitPath property is defined for both routes and the joined string is the same.
 * @param route - The first route to check.
 * @param route2 - The second route to check.
 * @returns true if the routes are mergeable, false otherwise.
 */
export function isMergeableEndpointRoute(
    route: EndpointRoute,
    route2: EndpointRoute,
): boolean {
    if (route.method !== route2.method) {
        return false
    }

    if (
        route.splitPath == undefined &&
        route2.splitPath == undefined
    ) {
        return true
    } else if (
        route.splitPath != undefined &&
        route2.splitPath != undefined &&
        route.splitPath.join("/") ==
        route2.splitPath.join("/")
    ) {
        return true
    }
    return false
}