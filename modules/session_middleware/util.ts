import {getCookies, setCookie} from "https://deno.land/std/http/cookie.ts";
import { Storage } from './storage.ts'

export const getSessionId = async (req: Request, storage: Storage): Promise<string> => {
    const sid = getCookies(req.headers)['sid']
    if(sid == undefined){
        return await storage.createSession()
    }else{
        return sid
    }
}

export const setSessionId = (res: Response, sid: string) => {
    setCookie(res.headers, {
        name: 'sid',
        value: sid
    })
}