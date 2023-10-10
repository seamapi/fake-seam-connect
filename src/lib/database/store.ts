import { enableMapSet } from "immer"
import { immer } from "zustand/middleware/immer"
import { createStore, type StoreApi } from "zustand/vanilla"
import { hoist } from "zustand-hoist"

import { simpleHash } from "lib/util/simple-hash.ts"
import type { AccessCode } from "lib/zod/access_code.ts"
import type { ActionAttempt } from "lib/zod/action_attempt.ts"
import type { ApiKey } from "lib/zod/api_key.ts"
import type { ClientSession } from "lib/zod/client_session.ts"
import type { ClimateSettingSchedule } from "lib/zod/climate_setting_schedule.ts"
import type { ConnectWebview } from "lib/zod/connect_webview.ts"
import type { ConnectedAccount } from "lib/zod/connected_account.ts"
import type { Device } from "lib/zod/device.ts"

import type { Database, ZustandDatabase } from "./schema.ts"

export const createDatabase = (): ZustandDatabase => {
  enableMapSet()
  return hoist<StoreApi<Database>>(createStore(initializer))
}

const initializer = immer<Database>((set, get) => ({
  _counters: {},
  simulatedWorkspaceOutages: {},
  client_sessions: [],
  workspaces: [],
  api_keys: [],
  connect_webviews: [],
  connected_accounts: [],
  devices: [],
  access_codes: [],
  climate_setting_schedules: [],
  action_attempts: [],

  _getNextId(type) {
    const count = (get()._counters[type] ?? 0) + 1
    set({ _counters: { ...get()._counters, [type]: count } })
    return `${type}${count}`
  },

  addWorkspace(params) {
    const pk_id = get()._getNextId("pk")
    const new_workspace = {
      workspace_id: params.workspace_id ?? get()._getNextId("workspace"),
      name: params.name,
      publishable_key:
        params.publishable_key ?? `seam_${pk_id}_${simpleHash(pk_id)}`,
      created_at: params.created_at ?? new Date().toISOString(),
    }
    set({
      workspaces: [...get().workspaces, new_workspace],
    })
    return new_workspace
  },

  addApiKey(params) {
    const api_key_id = get()._getNextId("api_key")
    const api_key_num = api_key_id.match(/\d+/)?.[0] ?? "0"
    const short_token = params.token?.split("_")?.[1] ?? `key${api_key_num}`
    const new_api_key: ApiKey = {
      api_key_id,
      name: params.name ?? `API Key ${api_key_num}`,
      token: params.token ?? `seam_${short_token}_${simpleHash(api_key_id)}`,
      workspace_id: params.workspace_id,
      short_token,
      created_at: params.created_at ?? new Date().toISOString(),
    }

    set({
      api_keys: [...get().api_keys, new_api_key],
    })

    return new_api_key
  },

  addClientSession(params) {
    const cst_id = get()._getNextId("cst")
    const new_cst: ClientSession = {
      workspace_id: params.workspace_id,
      connected_account_ids: params.connected_account_ids ?? [],
      connect_webview_ids: params.connect_webview_ids ?? [],
      client_session_id: cst_id,
      token: params.token ?? `seam_${cst_id}_${simpleHash(cst_id)}`,
      user_identifier_key: params.user_identifier_key as string,
      created_at: params.created_at ?? new Date().toISOString(),
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
    const new_connect_webview: ConnectWebview = {
      connect_webview_id: get()._getNextId("connect_webview"),
      workspace_id: params.workspace_id,
      status: "pending",
      accepted_providers: ["august"],
      created_at: params.created_at ?? new Date().toISOString(),
    }
    set({
      connect_webviews: [...get().connect_webviews, new_connect_webview],
    })
    return new_connect_webview
  },

  addDevice(params) {
    const new_device: Device = {
      device_id: params.device_id ?? get()._getNextId("device"),
      is_managed: true,
      device_type: params.device_type,
      connected_account_id: params.connected_account_id,
      capabilities_supported: ["lock", "access_code"],
      created_at: params.created_at ?? new Date().toISOString(),
      properties: {
        name: params.name,
        online: true,
        ...params.properties,
        model: {
          ...params.properties?.model,
          display_name: params.properties?.model?.display_name ?? "Device",
          manufacturer_display_name:
            params.properties?.model?.manufacturer_display_name ?? "Generic",
        },
      },
      workspace_id: params.workspace_id,
      errors: params.errors ?? [],
      warnings: params.warnings ?? [],
    }

    set({
      devices: [...get().devices, new_device],
    })

    return new_device
  },

  deleteDevice(params) {
    if ("device_ids" in params) {
      set({
        devices: [
          ...get().devices.filter((device) => {
            const is_target = params.device_ids.includes(device.device_id)

            return !is_target
          }),
        ],
      })
      return
    }

    const target = get().devices.find(
      (device) => device.device_id === params.device_id
    )
    if (target == null) {
      throw new Error("Could not find device with device_id")
    }

    set({
      devices: [
        ...get().devices.filter((device) => {
          const is_target = device.device_id === target.device_id

          return !is_target
        }),
      ],
    })
  },

  addConnectedAccount(params) {
    // @ts-expect-error  Partially implemented
    const new_connected_account: ConnectedAccount = {
      connected_account_id: get()._getNextId("connected_account"),
      provider: params.provider,
      workspace_id: params.workspace_id,
      created_at: params.created_at ?? new Date().toISOString(),
    }

    set({
      connected_accounts: [...get().connected_accounts, new_connected_account],
    })

    return new_connected_account
  },

  deleteConnectedAccount(params) {
    const target = get().connected_accounts.find(
      (connected_account) =>
        connected_account.connected_account_id === params.connected_account_id
    )
    if (target == null) {
      throw new Error(
        "Could not find connected_account with connected_account_id"
      )
    }

    set({
      connected_accounts: [
        ...get().connected_accounts.filter((connected_account) => {
          const is_target =
            connected_account.connected_account_id ===
            target.connected_account_id

          return !is_target
        }),
      ],
    })
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
    // @ts-expect-error  Partially implemented
    const new_access_code: AccessCode = {
      access_code_id: get()._getNextId("access_code"),
      created_at: params.created_at ?? new Date().toISOString(),
      is_managed: true,
      status: params.type === "ongoing" ? "setting" : "unset",
      errors: [],
      warnings: [],
      is_backup_access_code_available: false,
      is_external_modification_allowed: false,
      ...params,
    }

    set({
      access_codes: [...get().access_codes, new_access_code],
    })

    return new_access_code
  },

  findAccessCode(params) {
    return get().access_codes.find((access_code) => {
      const is_target_id = access_code.access_code_id === params.access_code_id
      const is_target_device = access_code.device_id === params.device_id

      return is_target_id || is_target_device
    })
  },

  updateAccessCode(params) {
    const target = get().access_codes.find(
      (access_code) => access_code.access_code_id === params.access_code_id
    )
    if (target == null) {
      throw new Error("Could not find access_code with access_code_id")
    }

    const updated: AccessCode = { ...target, ...params } as any

    set({
      access_codes: [
        ...get().access_codes.map((access_code) => {
          const is_target = access_code.access_code_id === target.access_code_id

          if (is_target) {
            return updated
          }

          return access_code
        }),
      ],
    })

    return updated
  },

  deleteAccessCode(params) {
    if ("access_code_ids" in params) {
      set({
        access_codes: [
          ...get().access_codes.filter((access_code) => {
            const is_target = params.access_code_ids.includes(
              access_code.access_code_id
            )

            return !is_target
          }),
        ],
      })
      return
    }

    const target = get().access_codes.find(
      (access_code) => access_code.access_code_id === params.access_code_id
    )
    if (target == null) {
      throw new Error("Could not find access_code with access_code_id")
    }

    set({
      access_codes: [
        ...get().access_codes.filter((access_code) => {
          const is_target = access_code.access_code_id === target.access_code_id

          return !is_target
        }),
      ],
    })
  },

  setPulledBackupAccessCodeId(params) {
    set({
      access_codes: get().access_codes.map((ac) => {
        if (ac.access_code_id === params.original_access_code_id) {
          return {
            ...ac,
            pulled_backup_access_code_id: params.pulled_backup_access_code_id,
          }
        }
        return ac
      }),
    })
  },

  addClimateSettingSchedule(params) {
    const new_climate_setting_schedule: ClimateSettingSchedule = {
      climate_setting_schedule_id: get()._getNextId("climate_setting_schedule"),
      created_at: params.created_at ?? new Date().toISOString(),
      ...params,
    }

    set({
      climate_setting_schedules: [
        ...get().climate_setting_schedules,
        new_climate_setting_schedule,
      ],
    })

    return new_climate_setting_schedule
  },

  findClimateSettingSchedule(params) {
    return get().climate_setting_schedules.find((climate_setting_schedule) => {
      const is_target_id =
        climate_setting_schedule.climate_setting_schedule_id ===
        params.climate_setting_schedule_id
      const is_target_device =
        climate_setting_schedule.device_id === params.device_id

      return is_target_id || is_target_device
    })
  },

  updateClimateSettingSchedule(params) {
    const target = get().climate_setting_schedules.find(
      (climate_setting_schedule) =>
        climate_setting_schedule.climate_setting_schedule_id ===
        params.climate_setting_schedule_id
    )
    if (target == null) {
      throw new Error(
        "Could not find climate_setting_schedule with climate_setting_schedule_id"
      )
    }

    const updated: ClimateSettingSchedule = { ...target, ...params }

    set({
      climate_setting_schedules: [
        ...get().climate_setting_schedules.map((climate_setting_schedule) => {
          const is_target =
            climate_setting_schedule.climate_setting_schedule_id ===
            target.climate_setting_schedule_id

          if (is_target) {
            return updated
          }

          return climate_setting_schedule
        }),
      ],
    })

    return updated
  },

  deleteClimateSettingSchedule(params) {
    const target = get().climate_setting_schedules.find(
      (climate_setting_schedule) =>
        climate_setting_schedule.climate_setting_schedule_id ===
        params.climate_setting_schedule_id
    )
    if (target == null) {
      throw new Error(
        "Could not find climate_setting_schedule with climate_setting_schedule_id"
      )
    }

    set({
      climate_setting_schedules: [
        ...get().climate_setting_schedules.filter(
          (climate_setting_schedule) => {
            const is_target =
              climate_setting_schedule.climate_setting_schedule_id ===
              target.climate_setting_schedule_id

            return !is_target
          }
        ),
      ],
    })
  },

  addActionAttempt(params) {
    // @ts-expect-error  Partially implemented
    const new_action_attempt: ActionAttempt = {
      ...params,
      action_attempt_id: get()._getNextId("action_attempt"),
      result: null,
      error: null,
      status: params.status ?? "pending",
    }

    set({
      action_attempts: [...get().action_attempts, new_action_attempt],
    })

    return new_action_attempt
  },

  findActionAttempt(params) {
    return get().action_attempts.find((action_attempt) => {
      return action_attempt.action_attempt_id === params.action_attempt_id
    })
  },

  updateActionAttempt(params) {
    const target = get().action_attempts.find(
      (action_attempt) =>
        action_attempt.action_attempt_id === params.action_attempt_id
    )
    if (target == null) {
      throw new Error("Could not find access_code with access_code_id")
    }

    const updated: ActionAttempt = { ...target, ...params } as any

    set({
      action_attempts: [
        ...get().action_attempts.map((action_attempt) => {
          const is_target =
            action_attempt.action_attempt_id === target.action_attempt_id

          if (is_target) {
            return updated
          }

          return action_attempt
        }),
      ],
    })

    return updated
  },

  simulateWorkspaceOutage(workspace_id, { routes }) {
    set((state) => {
      state.simulatedWorkspaceOutages[workspace_id] = {
        workspace_id,
        routes,
      }
    })
  },

  simulateWorkspaceOutageRecovery(workspace_id) {
    set((state) => {
      state.simulatedWorkspaceOutages[workspace_id] = undefined
    })
  },

  update() {},
}))
