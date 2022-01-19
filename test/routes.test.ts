import { assertEquals } from "./test.deps.ts";
import { GET, POST, route, join } from "../plumber/routes.ts";
import {RequestHandler} from '../plumber/baseTypes.ts'

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

const routerAssertions = async (router: RequestHandler) => {
  const req1 = new Request('https://example.com/get', {})

  const res1: Response = await router(req1, () => {
    return new Response('')
  })

  assertEquals(await res1.text(), 'Success!')

  const req2 = new Request('https://example.com/post', {method: 'POST'})

  const res2: Response = await router(req2, () => {
    return new Response('')
  })

  assertEquals(await res2.text(), 'Another success!') 
}

Deno.test('route method', async () => {
  const router = route(
    GET('/get', () => {
      return new Response('Success!')
    }),
    POST('/post', () => {
      return new Response('Another success!')
    })
  )
  
  await routerAssertions(router)
})

Deno.test('join', async () => {

  const router1 = route(
    GET('/get', () => {
      return new Response('Success!')
    })
  )

  const router2 = route(
    POST('/post', () => {
      return new Response('Another success!')
    })
  )

  const router = join(router1, router2)

  await routerAssertions(router)
})

Deno.test('route not found', async () => {
  const router = route(
    GET('/get', () => {
      return new Response('Success!')
    })
  )

  const req = new Request('https://example.com/get', {method: 'POST'})

  const res: Response = await router(req, () => {
    return new Response('')
  })

  assertEquals(res.status, 404)
  assertEquals(res.body, null)
})

Deno.test('route not found in join', async () => {
  const router1 = route(
    GET('/get', () => {
      return new Response('Success!')
    })
  )

  const router2 = route(
    POST('/post', () => {
      return new Response('Another success!')
    })
  )

  const router = join(router1, router2)

  const req = new Request('https://example.com/doesntExist', {method: 'GET'})

  const res: Response = await router(req, () => {
    return new Response('')
  })

  assertEquals(res.status, 404)
  assertEquals(res.body, null)
})