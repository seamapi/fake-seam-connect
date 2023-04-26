import {
  createDatabase,
  type Database,
  type DatabaseState,
} from 'lib/database/index.ts'

import { type Server, startServer } from 'lib/server.ts'

export const create = async (): Promise<Fake> => {
  const database = createDatabase()
  return new Fake(database)
}

class Fake {
  public server: Server | null
  public database: Database

  constructor(database: Database) {
    this.server = null
    this.database = database
  }

  async startServer(): Promise<Server> {
    this.server = await startServer({ database: this.database })
    return this.server
  }

  stopServer(): void {
    this.server?.close()
  }

  loadJSON(state: DatabaseState): void {
    this.database.setState(state)
  }

  toJSON(): DatabaseState {
    return this.database.getState()
  }

  update(): void {
    this.database.getState().update()
  }
}

export default create
