import {
  GET,
  POST,
  route,
  pipe,
  NextFunction
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
    const res = next()
    // Do something with res
    return new Response()
  }
)


serve(
  pipe(
    middleware,
    routes
  ),
  {
    port: 8080
  }
); // Now listening on port 8080
