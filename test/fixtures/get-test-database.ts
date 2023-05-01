import { type ExecutionContext } from 'ava'

import { createDatabase, type Thing } from 'index.ts'

import { type Database } from 'lib/database/types.ts'

export interface DatabaseFixture {
  db: Database
  seed: Seed
}

interface Seed {
  thing: Thing
  apiKey: string
}

export const getTestDatabase = async (
  _t: ExecutionContext
): Promise<DatabaseFixture> => {
  const db = createDatabase()

  db.addWorkspace()

  return { db, seed }
}
