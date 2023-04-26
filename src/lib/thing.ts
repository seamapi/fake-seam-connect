import { type Simplify } from 'type-fest'
import { z } from 'zod'

export const thingZod = z.object({
  thing_id: z.string(),
  type: z.enum(['superthing', 'lamething']),
  status: z.enum(['online', 'offline']),
})
export type Thing = Simplify<z.infer<typeof thingZod>>
export type ThingInitializer = Partial<Thing> & Pick<Thing, 'type'>
