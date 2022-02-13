import {getCookies, setCookie} from "https://deno.land/std/http/cookie.ts";

export const getSessionId = (req: Request): string => {
    return getCookies(req.headers)['sid']
}

export const setSessionId = (res: Response, sid: string) => {
    setCookie(res.headers, {
        name: 'sid',
        value: sid
    })
}

export const createSessionId = (): string => {
    return crypto.randomUUID()
}