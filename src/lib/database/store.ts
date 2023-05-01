import { immer } from 'zustand/middleware/immer'
import { createStore, type StoreApi } from 'zustand/vanilla'
import { hoist } from 'zustand-hoist'

import { type Database } from './types.ts'

export const createDatabase = (): Database => {
  return hoist<StoreApi<Database>>(createStore(initializer))
}

const initializer = immer<Database>((set, get) => ({
  _counters: {},

  client_session_tokens: [],
  workspaces: [],
  connect_webviews: [],
  connected_accounts: [],
  devices: [],

  _getNextId(type) {
    const count = (get()._counters[type] ?? 0) + 1
    set({ _counters: { ...get()._counters, [type]: count } })
    return `${type}_${count}`
  },

  addWorkspace(params) {
    const pkid = get()._getNextId('pk')
    const new_workspace = {
      workspace_id: get()._getNextId('workspace'),
      name: params.name,
      publishable_key: `seam_${pkid}_${Math.random().toString(16).slice(2)}`,
      created_at: new Date().toISOString(),
    }
    set({
      workspaces: [...get().workspaces, new_workspace],
    })
    return new_workspace
  },

  addClientSessionToken(params) {
    const new_cst = {}
  },

  update() {},
}))
