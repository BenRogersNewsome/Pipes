import { Handler } from "./deps.ts";
import { RequestHandler } from "./baseTypes.ts";

export const cap: (r: RequestHandler) => Handler = (handler: RequestHandler) =>
  async (req: Request) => {
    const [response, _context] = await handler(
      req,
      () => [new Response(), {}],
      {},
    );
    return response;
  };
