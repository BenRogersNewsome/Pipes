import { NextFunction } from "../plumber/baseTypes.ts";
import { join } from "../plumber/join.ts";
import { GET, POST, route } from "../plumber/routes.ts";
import { assertEquals } from "./deps.ts";

const mockNextFunction: NextFunction = (ctx) => {
  return [new Response(), ctx];
};

Deno.test("join correctly routes paths between routers", async () => {
  const router1 = route(
    GET("/req", (_req, _next, _ctx) => {
      return [new Response("Success!"), {}];
    }),
    GET("/req2", (_req, _next, _ctx) => {
      return [new Response("Another Another Success!"), {}];
    }),
  );

  const router2 = route(
    POST("/req", (_req, _next, _ctx) => {
      return [new Response("Another success!"), {}];
    }),
    POST("/req3", (_req, _next, _ctx) => {
      return [new Response("Another Another Another success!"), {}];
    }),
  );

  const router = join(router1, router2);

  const req1 = new Request("https://example.com/req", { method: "POST" });
  const [res1, _ctx1] = await router(req1, mockNextFunction, {});
  assertEquals(res1.status, 200);
  assertEquals(await res1.text(), "Another success!");

  const req2 = new Request("https://example.com/req", { method: "GET" });
  const [res2, _ctx2] = await router(req2, mockNextFunction, {});
  assertEquals(res2.status, 200);
  assertEquals(await res2.text(), "Success!");

  const req3 = new Request("https://example.com/req2", { method: "GET" });
  const [res3, _ctx3] = await router(req3, mockNextFunction, {});
  assertEquals(res3.status, 200);
  assertEquals(await res3.text(), "Another Another Success!");
});
