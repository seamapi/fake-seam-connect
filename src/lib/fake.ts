import {
  createDatabase,
  type Database,
  type DatabaseState,
  type Seed,
  seed as seedDatabase,
  type ZustandDatabase,
} from "lib/database/index.ts"

import { type Server, startServer } from "lib/server.ts"

export const createFake = async (): Promise<Fake> => {
  const database = createDatabase()
  return new Fake(database)
}

export class Fake {
  public server: Server | null

  public database: Database

  #database: ZustandDatabase

  constructor(database: ZustandDatabase) {
    this.server = null
    this.#database = database
    this.database = database
  }

  async startServer({
    port,
    signals = [],
  }: {
    port?: number
    signals?: string[]
  } = {}): Promise<Server> {
    this.server = await startServer({ port, signals, database: this.#database })
    return this.server
  }

  async stopServer(): Promise<void> {
    this.server?.close()
  }

  get serverUrl(): string | null | undefined {
    return this.server?.serverUrl
  }

  async seed(): Promise<Seed> {
    return seedDatabase(this.#database)
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
