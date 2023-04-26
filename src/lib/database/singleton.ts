import { createDatabase } from './store.ts'
import { type Database } from './types.ts'

let singletonDatabase

export const getSingletonDatabase = (): Database => {
  singletonDatabase ??= createDatabase()
  return singletonDatabase
}
