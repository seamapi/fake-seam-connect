import {
  createDatabase,
  type Database,
  type DatabaseState,
} from "lib/database/index.ts"

import { type Server, startServer } from "lib/server.ts"

export const createFake = async (): Promise<Fake> => {
  const database = createDatabase()
  return new Fake(database)
}

export class Fake {
  public server: Server | null

  public database: Omit<
    Database,
    "getState" | "setState" | "destroy" | "subscribe"
  >

  #database: Database

  constructor(database: Database) {
    this.server = null
    this.#database = database
    this.database = database
  }

  async startServer({ port }: { port?: number } = {}): Promise<Server> {
    this.server = await startServer({ port, database: this.#database })
    return this.server
  }

  async stopServer(): Promise<void> {
    this.server?.close()
  }

  get serverUrl(): string | null | undefined {
    return this.server?.serverUrl
  }

  async loadJSON(state: DatabaseState): Promise<void> {
    this.#database.setState(state)
  }

  async toJSON(): Promise<DatabaseState> {
    return this.#database.getState()
  }

  async update(): Promise<void> {
    this.#database.getState().update()
  }
}
