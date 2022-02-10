import { SessionData } from './types.ts'

export abstract class Storage {

    protected createSessionId(): string {
        return crypto.randomUUID()
    }

    public abstract createSession() : Promise<string>;
    public abstract getSession(sid: string) : Promise<SessionData>;
    public abstract setSession(sid: string, data: SessionData): void;
}

