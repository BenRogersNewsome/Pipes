import { assertEquals } from "./test.deps.ts";
import { GET } from "../methods.ts";

Deno.test("GET route", () => {
  const handler = (_req: Request) => {
    return new Response("Oioi");
  };
  const route = GET("/hello", handler);

  assertEquals(route, {
    pathname: "/hello",
    method: "GET",
    handler: handler,
    init: {},
  });
});
