type HTTPMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "TRACE"
  | "OPTIONS"
  | "CONNECT";
type RequestOptions = {};
type RequestHandler =
  | ((r: Request) => Response)
  | ((r: Request) => Promise<Response>);

export type Route = {
  handler: RequestHandler;
  pathname: string;
  method: HTTPMethod;
  init: RequestOptions;
};

const createRoute = (method: HTTPMethod) =>
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
