import { immer } from 'zustand/middleware/immer'
import { createStore, type StoreApi } from 'zustand/vanilla'
import { hoistMethods } from 'zustand-hoist'

import { type Database, type State } from './types.ts'

export const createDatabase = (): Database => {
  return hoistMethods<StoreApi<State>>(createStore(initializer))
}

const initializer = immer<State>((set, get) => ({
  thingCount: 0,
  things: [],

  addThing(thing) {
    set((state) => {
      state.thingCount++
      state.things.push({
        ...thing,
        status: 'online',
        thing_id: `thing_${state.thingCount}`,
      })
    })
    const newThing = get().things[get().things.length - 1]
    if (newThing == null) {
      throw new Error('Failed to find new thing in state')
    }
    return newThing
  },

  simulatePowerFailure(thingId) {
    set((state) => {
      const thing = state.things.find((t) => t.thing_id === thingId)
      if (thing == null) {
        throw new Error(`Thing "${thingId}" not found`)
      }
      thing.status = 'offline'
    })
  },
  update() {},
}))
