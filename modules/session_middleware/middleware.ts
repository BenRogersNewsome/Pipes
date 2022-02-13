import { RequestHandler } from "../../mod.ts";
import { StorageFactory } from './types.ts'

import {getSessionId, setSessionId} from './util.ts'
import { SessionData } from './types.ts '

export const sessionMiddleware: (storageFactory: StorageFactory) => RequestHandler = 
    (storageFactory: StorageFactory) => async (req, next, context) => {

        const storage = storageFactory()
        const sid = getSessionId(req) || await storage.createSession()

        const session = await storage.getSession(sid)

        const [response, {session: new_session, ...new_context}] = await next({
            session,
            ...context
        })

        storage.setSession(sid, new_session as SessionData || {})
        setSessionId(response, sid)

        return [response, new_context]
    }