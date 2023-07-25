import type { ZustandDatabase } from "./schema.ts"
import { createDatabase } from "./store.ts"

let singletonDatabase

export const getSingletonDatabase = (): ZustandDatabase => {
  singletonDatabase ??= createDatabase()
  return singletonDatabase
}
