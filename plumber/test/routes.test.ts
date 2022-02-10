import { assertEquals } from "./deps.ts";
import { GET, POST, route } from "../routes.ts";
import { NextFunction, RequestHandler } from "../baseTypes.ts";

const mockNextFunction: NextFunction = (ctx) => {
  return [new Response(), ctx];
};

// ### Test routes ###

Deno.test("GET route", () => {
  const handler: RequestHandler = (_req: Request, _next, _ctx) => {
    return [new Response("Oioi"), {}];
  };
  const route = GET("/hello", handler);

  // TODO
});

Deno.test("POST route", () => {
  const handler: RequestHandler = (_req: Request, _next, _ctx) => {
    return [new Response("Oioi"), {}];
  };
  const route = POST("/goodbye", handler);

  // TODO
});

// ### Test route method ###

Deno.test("route method correctly distinguishes methods", async () => {
  const router = route(
    GET("/req", (_req, _next, _ctx) => {
      return [new Response("Success!"), {}];
    }),
    POST("/req", (_req, _next, _ctx) => {
      return [new Response("Another success!"), {}];
    }),
  );

  const getReq = new Request("https://example.com/req", { method: "GET" });
  const postReq = new Request("https://example.com/req", { method: "POST" });

  const [getRes, _getCtx] = await router(getReq, mockNextFunction, {});
  const [postRes, _postCtx] = await router(postReq, mockNextFunction, {});

  assertEquals(await getRes.text(), "Success!");
  assertEquals(await postRes.text(), "Another success!");
});

Deno.test("route method correctly distinguishes pathnames", async () => {
  const router = route(
    GET("/req1", (_req, _next, _ctx) => {
      return [new Response("Success!"), {}];
    }),
    GET("/req2", (_req, _next, _ctx) => {
      return [new Response("Another success!"), {}];
    }),
  );

  const req1 = new Request("https://example.com/req1", { method: "GET" });
  const req2 = new Request("https://example.com/req2", { method: "GET" });

  const [res1, _ctx1] = await router(req1, mockNextFunction, {});
  const [res2, _ctx2] = await router(req2, mockNextFunction, {});

  assertEquals(await res1.text(), "Success!");
  assertEquals(await res2.text(), "Another success!");
});

Deno.test("route method returns 404 if no routes found", async () => {
  const router = route(
    GET("/req", (_req, _next, _ctx) => {
      return [new Response("Success!"), {}];
    }),
  );

  const req = new Request("https://example.com/different-req", {
    method: "GET",
  });

  const [res, _ctx] = await router(req, mockNextFunction, {});

  assertEquals(res.status, 404);
});

Deno.test("route method returns 405 if it finds a route but at the wrong method", async () => {
  const router = route(
    GET("/req", (_req, _next, _ctx) => {
      return [new Response("Success!"), {}];
    }),
  );

  const req = new Request("https://example.com/req", { method: "POST" });

  const [res, _ctx] = await router(req, mockNextFunction, {});

  assertEquals(res.status, 405);
});

Deno.test("route method doesn't return 405 if multiple methods", async () => {
  const router = route(
    GET("/req", (_req, _next, _ctx) => {
      return [new Response("Success!"), {}];
    }),
    POST("/req", (_req, _next, _ctx) => {
      return [new Response("Success!"), {}];
    }),
  );

  const req1 = new Request("https://example.com/req", { method: "POST" });
  const [res1, _ctx1] = await router(req1, mockNextFunction, {});
  assertEquals(res1.status, 200);

  const req2 = new Request("https://example.com/req", { method: "POST" });
  const [res2, _ctx2] = await router(req2, mockNextFunction, {});
  assertEquals(res1.status, 200);
});

// ### Test loading of url params ###

Deno.test("router loads url params into the context", async () => {
  const router = route(
    GET("/req/:name", (_req, _next, ctx) => {
      return [new Response("Success!"), ctx];
    }),
  );

  const req = new Request("https://example.com/req/plumber");

  const [res, ctx] = await router(req, mockNextFunction, {});

  assertEquals(await res.text(), "Success!");
  assertEquals(ctx, {
    params: {
      name: "plumber",
    },
  });
});

Deno.test("router matches everything if url is only parameter", async () => {
  const router = route(
    GET(":name", (_req, _next, ctx) => {
      return [new Response("Success!"), ctx];
    }),
  );

  const req = new Request("https://example.com/plumber");
  const [res, ctx] = await router(req, mockNextFunction, {});

  assertEquals(await res.text(), "Success!");
  assertEquals(ctx, {
    params: {
      name: "plumber",
    },
  });
});

// ### Test nesting routers

Deno.test("Nested router pathfinding", async () => {
  const innerRouter = route(
    GET("/inner", (_req, _next, ctx) => {
      return [new Response("Success!"), { ...ctx, inner: true }];
    }),
  );

  const outerRouter = route(
    GET("/outer/:name", innerRouter),
  );

  const req = new Request("https://example.com/outer/plumber/inner");

  const [res, ctx] = await outerRouter(req, mockNextFunction, {});

  assertEquals(await res.text(), "Success!");
  assertEquals(ctx, {
    inner: true,
    params: {
      name: "plumber",
    },
  });
});

// Deno.test("join", async () => {
//   const router1 = route(
//     GET("/get", (_req, _next, _ctx) => {
//       return [new Response("Success!"), {}];
//     }),
//   );

//   const router2 = route(
//     POST("/post", (_req, _next, _ctx) => {
//       return [new Response("Another success!"), {}];
//     }),
//   );

//   const router = join(router1, router2);

//   await routerAssertions(router);
// });

// Deno.test("route not found in join", async () => {
//   const router1 = route(
//     GET("/get", (_req, _next, _ctx) => {
//       return [new Response("Success!"), {}];
//     }),
//   );

//   const router2 = route(
//     POST("/post", (_req, _next, _ctx) => {
//       return [new Response("Another success!"), {}];
//     }),
//   );

//   const router = join(router1, router2);

//   const req = new Request("https://example.com/doesntExist", { method: "GET" });

//   const [res, _ctx] = await router(req, () => {
//     return [new Response(""), {}]
//   }, {});

//   assertEquals(res.status, 404);
//   assertEquals(res.body, null);
// });
