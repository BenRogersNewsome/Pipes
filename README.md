# Pipes

Pipes is a lightweight, functional helper for creating a routed HTTP server.

## An example

```typescript
import {
  createServer,
  GET,
  POST,
  route,
} from "https://deno.land/x/pipes/mod.ts";

const routes = route(
  GET("/index", (_req: Request) => {
    // Do something
    return new Response("Hey!");
  }),
  POST("/add", (_req: Request) => {
    // Do something else
    return new Response("Thanks!");
  }),
);

const serve = createServer(routes);

serve({ port: 8080 }); // Now listening on port 8080
```
