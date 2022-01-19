import { RequestHandler, RequestOptions, HTTPMethod} from './baseTypes.ts'
import {find} from './utils.ts'

export type Route = {
    handler: RequestHandler;
    pathname: string;
    method: HTTPMethod;
    init: RequestOptions;
  };

export type Router = RequestHandler

export const route : (...routes: Route[]) => Router = (...routes: Route[]) =>
  async (req, next): Promise<Response> => {
    const url = new URL(req.url);

    const route = find<Route>(routes, (r: Route) => (
      r.pathname == url.pathname &&
      r.method == req.method
    ));

    if (route) {
      return await route.handler(req, next);
    }

    return new Response(null, { status: 404 });
  };


/**
 * 
 * Take two routers and create a singe router with the combination of their routes.
 * 
 * @param routers 
 * @returns router
 */
export const join : (...routers: Router[]) => Router =  (...routers: Router[]) =>
  async (req, next): Promise<Response> => {
      for(const router of routers){
          const response = await router(req, next)
          if(response.status !== 404){
              return response
          }
      }
      return new Response(null, { status: 404 })
  }

export const createRoute = (method: HTTPMethod) =>
  (
    pathname: string,
    handler: RequestHandler,
    init: RequestOptions = {},
  ): Route => {
    return {
      handler: handler,
      pathname: pathname,
      init: init,
      method: method,
    };
  };

export const GET = createRoute("GET");
export const POST = createRoute("POST");
