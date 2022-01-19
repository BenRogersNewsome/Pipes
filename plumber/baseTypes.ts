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

export type NextFunction =
  | (() => Promise<Response>)
  | (() => Response)

export type RequestHandler =
  | ((req: Request, next: NextFunction) => Response)
  | ((r: Request, next: NextFunction) => Promise<Response>);