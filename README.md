# bun-route
![CI/CD](https://github.com/noblemajo/bun-route/actions/workflows/npm-publish.yml/badge.svg)
![MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![typescript](https://img.shields.io/badge/dynamic/json?style=plastic&color=blue&label=Typescript&prefix=v&query=peerDependencies.typescript&url=https%3A%2F%2Fraw.githubusercontent.com%2Fnoblemajo%2Fbun-route%2Fmain%2Fpackage.json)
![npm](https://img.shields.io/npm/v/bun-route.svg?style=plastic&logo=npm&color=red)
<!-- ![github](https://img.shields.io/badge/dynamic/json?style=plastic&color=darkviolet&label=GitHub&prefix=v&query=version&url=https%3A%2F%2Fraw.githubusercontent.com%2Fnoblemajo%2Fbun-route%2Fmain%2Fpackage.json) -->

![](https://img.shields.io/badge/dynamic/json?color=green&label=watchers&query=watchers&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fnoblemajo%2Fbun-route)
![](https://img.shields.io/badge/dynamic/json?color=yellow&label=stars&query=stargazers_count&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fnoblemajo%2Fbun-route)
![](https://img.shields.io/badge/dynamic/json?color=navy&label=forks&query=forks&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fnoblemajo%2Fbun-route)
<!-- ![](https://img.shields.io/badge/dynamic/json?color=darkred&label=open%20issues&query=open_issues&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fnoblemajo%2Fbun-route)
![](https://img.shields.io/badge/dynamic/json?color=orange&label=subscribers&query=subscribers_count&suffix=x&url=https%3A%2F%2Fapi.github.com%2Frepos%2Fnoblemajo%2Fbun-route) -->

**A fast, Express-like router for the high-performance `bun.serve()` HTTP server.**

`bun-route` leverages Bun.js's powerful `bun.serve` to deliver a fast, familiar, and reliable routing experience. It provides developers with an easy-to-use, Express-like API, tailored for high-performance applications built with Bun.js.

*At the **time of `bun-route`'s creation**, Bun.js did not include a built-in router, so `bun-route` was designed as a lightweight, dependency-free solution to fill that gap.*

# features

## life improvement

- **wildcards**: Can handle double wildcards (`**`) as any recursive path and 
  single wildcards (`*`) as any path part. *It also provides a path parameter string array".*
  If enabled, cookies can also automatically be set/unset to the response headers. 
- **static-serve**: Serves static files via a middleware ([example](https://github.com/NobleMajo/bun-route/blob/main/examples/static-serve.ts)).
- **dump-router**: You can create a string router dump that lists the defined routes.
  If you provide a bun server, it also adds a `server-is-running-on` message.
- **basic-auth**: Protects the following via HTTP basic auth ([example](https://github.com/NobleMajo/bun-route/blob/main/examples/basic-auth.ts)).
- **cookie-handling**: Cookie parsing can be enabled via a middleware ([example](https://github.com/NobleMajo/bun-route/blob/main/examples/cookies.ts)).  
- **redirect-handler**: You can redirect via the `ResponseBuilder` or
  via a redirect middleware ([example](https://github.com/NobleMajo/bun-route/blob/main/examples/redirect.ts)).
- **websocket-support**: Can handle websocket request via a middleware ([example](https://github.com/NobleMajo/bun-route/blob/main/examples/websocket.ts)).

## performance

- **non-async-first**: Tries to resolve a request in a non-async way until an async handler is hit.
- **merged-routes**: If 2 or more routes are defined one after the other with the same method and path,
  they will be merged into a single handler to avoid re-checking.
- **method-enum**: You just write `GET`, but in the background it is converted to an enum.  
  *This is for faster method comparison.*

# usage

## install

```sh
bun i github:NobleMajo/bun-route
```

## import 

```ts
import { Router } from "bun-route/src/index";
```

## example

```ts
import { Router } from "bun-route/src/index";

const router = new Router()

// handles GET requests to /
router.get("/", (req, res) => {
    res.send("Root request")
})

// use the native bun.serve function the router as request handler
const server = Bun.serve({
    fetch: router.handle,
})

// dumps router routes and server-is-running-on message
console.info(router.dump(server))
```

# examples

Checkout the bun-route [examples](https://github.com/NobleMajo/bun-route/tree/main/examples):
- [simple example](https://github.com/NobleMajo/bun-route/blob/main/examples/simple.ts)
- [static-serve example](https://github.com/NobleMajo/bun-route/blob/main/examples/static-serve.ts)
- [websocket example](https://github.com/NobleMajo/bun-route/blob/main/examples/websocket.ts)
- [redirect example](https://github.com/NobleMajo/bun-route/blob/main/examples/redirect.ts)
- [cookies example](https://github.com/NobleMajo/bun-route/blob/main/examples/cookies.ts)
- [basic auth example](https://github.com/NobleMajo/bun-route/blob/main/examples/basic-auth.ts)

Run a example:
```sh
git clone https://github.com/NobleMajo/bun-route.git

bun run examples/simple.ts
```

# tests

The router has build-in tests.

```ts
bun test
```

# future features
Here are some feature ideas for future development:
- **CORS-support**: Configure CORS headers via a buildin middleware.
- **router.serve**: Serve/listen function to start the server via the router (first parameter should be the bun.serve options without fetch).
- **websocket**: Better websocket support with more origin request infos.

# Contributing
Contributions to this project are welcome!  
Interested users can refer to the guidelines provided in the [CONTRIBUTING.md](CONTRIBUTING.md) file to contribute to the project and help improve its functionality and features.

# License
This project is licensed under the [MIT license](LICENSE), providing users with flexibility and freedom to use and modify the software according to their needs.

# Disclaimer
This project is provided without warranties.  
Users are advised to review the accompanying license for more information on the terms of use and limitations of liability.
