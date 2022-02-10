import {RequestHandler, OPTIONS, route} from '../../mod.ts'


type CorsOptions = {
    'Access-Control-Allow-Origin': string,
    'Access-Control-Allow-Methods': string,
    'Access-Control-Allow-Headers': string,
    'Access-Control-Max-Age': string,
}

const generateCorsResponse = (options: CorsOptions) => {
    const headers = new Headers()

    headers.set('Access-Control-Allow-Origin', options['Access-Control-Allow-Origin'])
    headers.set('Access-Control-Allow-Methods', options['Access-Control-Allow-Methods'])
    headers.set('Access-Control-Allow-Headers', options['Access-Control-Allow-Headers'])
    headers.set('Access-Control-Max-Age', options['Access-Control-Max-Age'])
    
    return new Response(null, {headers, status: 204})
}

/**
 * 
 * CORS(GET('/.../', (req) => {
 *  
 * }))
 * 
 */

export const CORS: (options: CorsOptions) => (handler: RequestHandler) => RequestHandler =
    (options) => 
    (handler) =>
    async (req, next, ctx) => {
        
        const corsHandler = OPTIONS('/', (_req, _next, ctx) => {

            const headers = new Headers()

            headers.set('Access-Control-Allow-Methods', options['Access-Control-Allow-Methods'])
            headers.set('Access-Control-Allow-Headers', options['Access-Control-Allow-Headers'])
            headers.set('Access-Control-Max-Age', options['Access-Control-Max-Age'])
            
            return [generateCorsResponse(options), ctx]
        })

        const [res, newCtx] = await route(corsHandler, handler)(req, next, ctx)
        
        res.headers.set('Access-Control-Allow-Origin', options['Access-Control-Allow-Origin'])
        
        return [res, newCtx]
    }



/**
 * pipe(
 *  cors(...options),
 *  routes
 * )
 */

const CORSMiddleware: (options: CorsOptions) => RequestHandler = (options) => async (req, next, ctx) => {
    if(
        req.method == 'OPTIONS' && 
        req.headers.has('Access-Control-Request-Method') &&
        req.headers.has('Access-Control-Request-Headers') &&
        req.headers.has('Origin')
    ){
        return [generateCorsResponse(options), ctx]
    }else{
        return await next(ctx)
    }
}