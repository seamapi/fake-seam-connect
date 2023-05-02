import { type ExecutionContext } from 'ava'

import { createDatabase, type Thing } from 'index.ts'

import { type Database } from 'lib/database/types.ts'

export interface DatabaseFixture {
  db: Database
  seed: Seed
}

interface Seed {
  ws1: {
    workspace_id: string
    publishable_key: string
  }
  ws2: {
    workspace_id: string
    publishable_key: string
    // TODO
    // connected_account1_id: string
    // device1_id: string
  }
}

export const getTestDatabase = async (
  _t: ExecutionContext
): Promise<DatabaseFixture> => {
  const db = createDatabase()

  const ws1 = db.addWorkspace({ name: 'Seed Workspace 1 (starts empty)' })
  const ws2 = db.addWorkspace({ name: 'Seed Workspace 2 (starts populated)' })

  const seed = {
    ws1: {
      workspace_id: ws1.workspace_id,
      publishable_key: ws1.publishable_key,
    },
    ws2: {
      workspace_id: ws2.workspace_id,
      publishable_key: ws2.publishable_key,
    },
  } as Seed

  return { db, seed }
}
