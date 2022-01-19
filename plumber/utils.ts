import { RequestHandler, NextFunction } from './baseTypes.ts'

export const find = <T>(arr: T[], condition: (t: T) => boolean) => {
  for (const item of arr) {
    if (condition(item)) {
      return item;
    }
  }

  return null;
};

const reduceMap = <S, T>(iterable: S[], map: (current: S, accum: T) => T, initial: T) => {
  let accum = initial
  for(const item of iterable){
    accum = map(item, accum)
  }
  return accum
}

export const pipe : (...functions: RequestHandler[]) => RequestHandler = (...functions: RequestHandler[]) => async (req: Request, next: NextFunction) : Promise<Response> => {

  const piped = reduceMap(functions.reverse(), (handler, accum) => {
    return async () => {
      return await handler(req, accum)
    }
  }, next)

  return await piped()

}