import { immer } from "zustand/middleware/immer"
import { createStore, type StoreApi } from "zustand/vanilla"
import { hoist } from "zustand-hoist"

import { simpleHash } from "lib/util/simple-hash.ts"
import { type AccessCode } from "lib/zod/access_code.ts"
import { type ClientSession } from "lib/zod/client_session.ts"
import { type ConnectWebview } from "lib/zod/connect_webview.ts"
import { type ConnectedAccount } from "lib/zod/connected_account.ts"
import { type Device } from "lib/zod/device.ts"

import {
  type Database,
  type DatabaseMethods,
  type DatabaseState,
} from "./types.ts"

export const createDatabase = (): Database => {
  return hoist<StoreApi<DatabaseState & DatabaseMethods>>(
    createStore(initializer)
  )
}

const initializer = immer<DatabaseState & DatabaseMethods>((set, get) => ({
  _counters: {},

  client_sessions: [],
  workspaces: [],
  connect_webviews: [],
  connected_accounts: [],
  devices: [],
  access_codes: [],

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
      publishable_key:
        params.publishable_key ?? `seam_${pk_id}_${simpleHash(pk_id)}`,
      created_at: new Date().toISOString(),
    }
    set({
      workspaces: [...get().workspaces, new_workspace],
    })
    return new_workspace
  },

  addClientSession(params) {
    const cst_id = get()._getNextId("cst")
    const new_cst: ClientSession = {
      workspace_id: params.workspace_id,
      connected_account_ids: params.connected_account_ids ?? [],
      connect_webview_ids: params.connect_webview_ids ?? [],
      client_session_id: cst_id,
      long_token: simpleHash(cst_id),
      short_token: cst_id,
      token: params.token ?? `seam_${cst_id}_${simpleHash(cst_id)}`,
      user_identifier_key: params.user_identifier_key as string,
      created_at: new Date().toISOString(),
    }

    set({
      client_sessions: [...get().client_sessions, new_cst],
    })

    return new_cst
  },

  updateClientSession(params) {
    set({
      client_sessions: get().client_sessions.map((cst) => {
        if (cst.client_session_id === params.client_session_id) {
          return {
            ...cst,
            connected_account_ids:
              params.connected_account_ids ?? cst.connected_account_ids,
            connect_webview_ids:
              params.connect_webview_ids ?? cst.connect_webview_ids,
          }
        }
        return cst
      }),
    })
  },

  addConnectWebview(params) {
    const new_connect_webview = {
      connect_webview_id: get()._getNextId("connect_webview"),
      workspace_id: params.workspace_id,
      status: "pending",
      accepted_providers: ["august"],
      created_at: new Date().toISOString(),
    } as ConnectWebview
    set({
      connect_webviews: [...get().connect_webviews, new_connect_webview],
    })
    return new_connect_webview
  },

  addDevice(params) {
    const new_device = {
      device_id: get()._getNextId("device"),
      device_type: params.device_type ?? "august_lock",
      connected_account_id: params.connected_account_id,
      capabilities_supported: ["lock", "access_code"],
      created_at: new Date().toISOString(),
      properties: {
        name: params.name,
        online: true,
      },
      workspace_id: params.workspace_id,
    } as Device

    set({
      devices: [...get().devices, new_device],
    })

    return new_device
  },

  addConnectedAccount(params) {
    const new_connected_account = {
      connected_account_id: get()._getNextId("connected_account"),
      provider: params.provider,
      workspace_id: params.workspace_id,
      created_at: new Date().toISOString(),
    } as ConnectedAccount

    set({
      connected_accounts: [...get().connected_accounts, new_connected_account],
    })

    return new_connected_account
  },

  updateConnectWebview(params) {
    set({
      connect_webviews: get().connect_webviews.map((cw) => {
        if (cw.connect_webview_id === params.connect_webview_id) {
          return {
            ...cw,
            ...params,
          }
        }
        return cw
      }),
    })
  },

  addAccessCode(params) {
    const new_access_code = {
      access_code_id: get()._getNextId("access_code"),
      device_id: params.device_id,
      name: params.name,
      code: params.code,
      created_at: new Date().toISOString(),
    } as AccessCode

    set({
      access_codes: [...get().access_codes, new_access_code],
    })

    return new_access_code
  },

  update() {},
}))
