import { Client } from "https://deno.land/x/postgres@v0.15.0/mod.ts";
import { SessionData, StorageFactory } from '../session_middleware/mod.ts'
import { createSessionId } from '../session_middleware/mod.ts'
import { PostgresStorageConfig } from './types.ts'
import {init, postgres} from 'https://deno.land/x/dsql@v0.0.2/src/mod.ts'

export const createPostgresStorage = ({tableName='plumber_sessions'}: PostgresStorageConfig) => (client: Client) : StorageFactory => () => {

    const {Query} = init(postgres(client))

    const createSession = async () : Promise<string> => {
        console.info('Creating session')
        const sid = createSessionId()
        await client.queryArray(`INSERT INTO session (sid, data) VALUES ('${sid}', '{}')`)
        return sid;
    }

    const getSession = async (sid: string) : Promise<SessionData> => {
        const db_response = await client.queryArray(`SELECT data FROM session WHERE sid = '${sid}'`)
        const data = db_response.rows.map(item => item[0])
        return data[0] as SessionData
    }

    const setSession = async (sid: string, data: Record<string, unknown>) : Promise<void> => {
        await client.queryArray(
            `UPDATE session SET data='${JSON.stringify(data)}' WHERE sid = '${sid}'`
        )
    }

    const migrate = () => {
        return Query`
            CREATE TABLE ${tableName} (
                sid VARCHAR(36) PRIMARY KEY,
                data JSONB NOT NULL
            );
        `
    }

    return {createSession, getSession, setSession, migrate}
}