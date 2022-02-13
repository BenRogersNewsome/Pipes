import {DBEntity} from '../db/mod.ts'

export type SessionData = Record<string, unknown>

export type Storage = DBEntity & {
    createSession: () => Promise<string>,
    getSession: (sid: string) => Promise<SessionData>,
    setSession: (sid: string, data: SessionData) =>  void,
}

export type StorageFactory = () => Storage