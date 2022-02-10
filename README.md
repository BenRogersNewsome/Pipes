# Plumber

Pipes is a lightweight, functional helper for creating a routed HTTP server.

## An example

```typescript
import {
  GET,
  NextFunction,
  pipe,
  POST,
  route,
} from "https://deno.land/x/plumber/mod.ts";

import { serve } from "https://deno.land/std@0.121.0/http/server.ts";

const routes = route(
  GET("/index", (_req: Request, next: NextFunction) => {
    // Do something
    return new Response("Hey!");
  }),
  POST("/add", (_req: Request) => {
    // Do something else
    return new Response("Thanks!");
  }),
);

const middleware = pipe(
  (req: Request, next: NextFunction) => {
    const res = next();
    // Do something with res
    return new Response();
  },
);

serve(
  pipe(
    middleware,
    routes,
  ),
  {
    port: 8080,
  },
); // Now listening on port 8080
```

# Examples

## Middleware followed by routes

```typescript
serve(
  cap(
    pipe(
      middleware,
      routes,
    ),
  ),
);
```

## Session middleware only behind user parts of site

```typescript
const userPipe = pipe(
  sessionMiddleware,
  userRoutes,
);

const anonymousPipe = anonymousRoutes;

const router = route(
  GET("/user", userPipe),
  GET("/", anonymousPipe),
);

serve(
  cap(
    pipe(
      middleware,
      router,
    ),
  ),
);
```

```typescript
pipe(
  middleware,
  route(
    route1,
    route2,
    route3,
  )
  moreMiddleware,
)
```
