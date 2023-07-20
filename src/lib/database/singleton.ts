import type { Database } from "./schema.ts"
import { createDatabase } from "./store.ts"

let singletonDatabase

export const getSingletonDatabase = (): Database => {
  singletonDatabase ??= createDatabase()
  return singletonDatabase
}
