import { HandlerState, RequestHandler } from "./baseTypes.ts";

/**
 * Take two routers and create a singe router with the combination of their routes.
 */
export const join: (...routers: RequestHandler[]) => RequestHandler = (
  ...routers: RequestHandler[]
) =>
  async (req, next, context): Promise<HandlerState> => {
    let notFoundStatus = 404;
    for (const router of routers) {
      const [response, new_context] = await router(req, next, context);
      if (response.status == 404) {
        continue;
      } else if (response.status == 405) {
        notFoundStatus = 405;
        continue;
      } else {
        return [response, new_context];
      }
    }
    return [new Response(null, { status: notFoundStatus }), context];
  };
