import { HTTPMethod, RequestHandler } from "./baseTypes.ts";

/**
 * Match on first route which doesn't throw a RouteDoesntMatch.
 *
 * If all routes throw, return 404.
 */
export const route: (...routes: RequestHandler[]) => RequestHandler = (
  ...routes: RequestHandler[]
) =>
  async (req, next, ctx) => {
    let notFoundStatus = 404; // TODO: Make this functional

    for (const route of routes) {
      try {
        return await route(req, next, ctx);
      } catch (err) {
        if (err instanceof RouteDoesntMatch) {
          continue;
        } else if (err instanceof MethodDoesntMatch) {
          notFoundStatus = 405;
          continue;
        } else {
          throw err;
        }
      }
    }
    return [new Response(null, { status: notFoundStatus }), ctx];
  };

class RouteDoesntMatch extends Error {
}

class MethodDoesntMatch extends Error {
}

/**
 * Try to match a route. Load any url params into a dict and return. Also return the url tail which remains after matching.
 */
const loadRoute = (
  urlPathnameSegments: string[],
  routePathnameSegments: string[],
): [Record<string, string>, string[]] => {
  const [currentRouteSegment, ...routeTail] = routePathnameSegments;
  const [currentUrlSegment, ...urlTail] = urlPathnameSegments;

  if (routePathnameSegments.length == 0) {
    return [{}, urlPathnameSegments];
  }

  const [ctx, newUrlTail] = loadRoute(urlTail, routeTail);
  if (currentRouteSegment[0] == ":") {
    const existingParams = ctx.params || {};
    return [{
      [currentRouteSegment.split(":")[1]]: currentUrlSegment,
      ...existingParams,
    }, newUrlTail];
  } else if (urlPathnameSegments[0] == routePathnameSegments[0]) {
    return [{
      ...ctx,
    }, newUrlTail];
  } else {
    throw new RouteDoesntMatch();
  }
};

const getPathnameSegments = (pathname: string) =>
  pathname.split("/").filter((item) => Boolean(item));

const matchRoute = (
  req: Request,
  routePathname: string,
  routeMethod: HTTPMethod,
): [Record<string, string>, string] => {
  const url = new URL(req.url);
  const urlPathnameSegments = getPathnameSegments(url.pathname);
  const routePathnameSegments = getPathnameSegments(routePathname);

  const [params, urlTail] = loadRoute(
    urlPathnameSegments,
    routePathnameSegments,
  );

  if (req.method != routeMethod) throw new MethodDoesntMatch();

  return [params, urlTail.join("/")];
};

export const createRoute = (method: HTTPMethod) =>
  (
    pathname: string,
    handler: RequestHandler,
  ): RequestHandler =>
    async (req, next, ctx) => {
      const [params, urlTail] = matchRoute(req, pathname, method);

      // We throw this here so that we only throw a MethodDoesntMatch after we would otherwise throw a RouteDoesntMatch.
      // The advantage of this is that we can catch the MethodDoesntMatch and return a 405 instead of a 404.
      if (req.method != method) {
        throw new MethodDoesntMatch();
      }

      const url = new URL(req.url);
      const newReq = new Request(`${url.protocol}${url.host}/${urlTail}`, {
        ...req,
      });

      return await handler(newReq, next, { params, ...ctx });
    };

export const GET = createRoute("GET");
export const POST = createRoute("POST");
export const OPTIONS = createRoute("OPTIONS");
