import { assertEquals } from "./test.deps.ts";

import {pipe} from '../plumber/utils.ts'
import {NextFunction} from '../plumber/baseTypes.ts'

Deno.test('pipe', async () => {

    const piped = pipe(
        async (req: Request, next: NextFunction) => {
            const res: Response  = await next()
            return new Response(`${await res.text()}, method: ${req.method}`)
        },
        async (req: Request, next: NextFunction) => {
            await next()
            return new Response(`Requested: ${req.url}`)
        }
    )

    const req = new Request('https://example.com/get', {method: 'POST'})

    const res: Response = await piped(req, () => {
        return new Response('')
    })


    assertEquals(await res.text(), 'Requested: https://example.com/get, method: POST')
})