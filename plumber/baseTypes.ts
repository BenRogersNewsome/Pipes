export type HTTPMethod =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "TRACE"
  | "OPTIONS"
  | "CONNECT";

export type RequestOptions = {};

export type Context = Record<string, unknown>;

export type HandlerState = [Response, Context];

export type NextFunction =
  | ((context: Context) => Promise<HandlerState>)
  | ((context: Context) => HandlerState);

export type RequestHandler =
  | ((req: Request, next: NextFunction, context: Context) => HandlerState)
  | ((
    r: Request,
    next: NextFunction,
    context: Context,
  ) => Promise<HandlerState>);
