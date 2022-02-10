import { HandlerState, NextFunction, RequestHandler } from "./baseTypes.ts";

const reduceMap = <S, T>(
  iterable: S[],
  map: (current: S, accum: T) => T,
  initial: T,
) => {
  let accum = initial;
  for (const item of iterable) {
    accum = map(item, accum);
  }
  return accum;
};

export const pipe: (...functions: RequestHandler[]) => RequestHandler = (
  ...functions: RequestHandler[]
) =>
  async (req: Request, next: NextFunction, context): Promise<HandlerState> => {
    const piped = reduceMap(functions.reverse(), (handler, accum) => {
      return async (ctx) => {
        return await handler(req, accum, ctx);
      };
    }, next);

    return await piped(context);
  };
