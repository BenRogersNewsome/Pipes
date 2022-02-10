import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts";
import { Storage, SessionData } from '../session_middleware/mod.ts'

export class PostgresStorage extends Storage {
    
    readonly client: Client;

    constructor(client: Client){
        super()
        this.client = client;
    }

    public async createSession() : Promise<string> {
        console.info('Creating session')
        const sid = this.createSessionId()
        await this.client.queryArray(`INSERT INTO session (sid, data) VALUES ('${sid}', '{}')`)
        return sid;
    }

    public async getSession(sid: string) : Promise<SessionData> {
        const db_response = await this.client.queryArray(`SELECT data FROM session WHERE sid = '${sid}'`)
        const data = db_response.rows.map(item => item[0])
        return data[0] as SessionData
    }

    public async setSession(sid: string, data: Record<string, unknown>) : Promise<void> {
        await this.client.queryArray(
            `UPDATE session SET data='${JSON.stringify(data)}' WHERE sid = '${sid}'`
        )
    }
}