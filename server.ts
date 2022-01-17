import {
  serve as _serve,
  ServeInit,
} from "https://deno.land/std@0.121.0/http/server.ts";
import { find } from "./utils.ts";
import { Route } from "./methods.ts";

export const route = (...routes: Route[]) =>
  async (req: Request): Promise<Response> => {
    const url = new URL(req.url);

    const route = find<Route>(routes, (r: Route) => (
      r.pathname == url.pathname &&
      r.method == req.method
    ));

    if (route) {
      return await route.handler(req);
    }

    return new Response(null, { status: 404 });
  };

export const createServer = (...routes: Route[]) =>
  (init: ServeInit) => _serve(route(...routes), init);
