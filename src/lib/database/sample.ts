import { createDatabase } from './store.ts'
import { type Database } from './types.ts'

export const createSampleDatabase = (): Database => {
  const db = createDatabase()
  db.getState().addThing({ type: 'superthing' })
  return db
}
