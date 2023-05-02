import { immer } from "zustand/middleware/immer"
import { createStore, type StoreApi } from "zustand/vanilla"
import { hoist } from "zustand-hoist"

import { type Database } from "./types.ts"
import { ClientSession } from "lib/zod/client_session.ts"
import { simpleHash } from "lib/util/simple-hash.ts"

export const createDatabase = (): Database => {
  return hoist<StoreApi<Database>>(createStore(initializer))
}

const initializer = immer<Database>((set, get) => ({
  _counters: {},

  client_sessions: [],
  workspaces: [],
  connect_webviews: [],
  connected_accounts: [],
  devices: [],

  _getNextId(type) {
    const count = (get()._counters[type] ?? 0) + 1
    set({ _counters: { ...get()._counters, [type]: count } })
    return `${type}${count}`
  },

  addWorkspace(params) {
    const pk_id = get()._getNextId("pk")
    const new_workspace = {
      workspace_id: get()._getNextId("workspace"),
      name: params.name,
      publishable_key: `seam_${pk_id}_${simpleHash(pk_id)}`,
      created_at: new Date().toISOString(),
    }
    set({
      workspaces: [...get().workspaces, new_workspace],
    })
    return new_workspace
  },

  addClientSessionToken(params) {
    const cst_id = get()._getNextId("cst")
    const new_cst: ClientSession = {
      workspace_id: params.workspace_id,
      connected_account_ids: params.connected_account_ids ?? [],
      connect_webview_ids: params.connect_webview_ids ?? [],
      client_session_token_id: cst_id,
      long_token: simpleHash(cst_id),
      short_token: cst_id,
      token: `seam_${cst_id}_${simpleHash(cst_id)}`,
      user_identifier_key: params.user_identifier_key as string,
      created_at: new Date().toISOString(),
    }

    set({
      client_sessions: [...get().client_sessions, new_cst],
    })

    return new_cst
  },

  update() {},
}))
