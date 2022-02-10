import { RequestHandler } from "../../mod.ts";
import { Storage } from './storage.ts'

import {getSessionId, setSessionId} from './util.ts'
import { SessionData } from './types.ts '

export const sessionMiddleware: (storage: Storage) => RequestHandler = (storage: Storage) => async (req, next, context) => {
    const sid = await getSessionId(req, storage)
    const session = await storage.getSession(sid)

    const [response, {session: new_session, ...new_context}] = await next({
        session,
        ...context
    })

    storage.setSession(sid, new_session as SessionData || {})
    setSessionId(response, sid)

    return [response, new_context]
}