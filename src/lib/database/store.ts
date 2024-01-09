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
import type { Event } from "lib/zod/event.ts"
import type { NoiseThreshold } from "lib/zod/noise_threshold.ts"

import type { Database, ZustandDatabase } from "./schema.ts"

export const createDatabase = (): ZustandDatabase => {
  enableMapSet()
  return hoist<StoreApi<Database>>(createStore(initializer))
}

const initializer = immer<Database>((set, get) => ({
  _counters: {},
  devicedbConfig: null,
  simulatedWorkspaceOutages: {},
  client_sessions: [],
  workspaces: [],
  api_keys: [],
  connect_webviews: [],
  connected_accounts: [],
  devices: [],
  events: [],
  access_codes: [],
  climate_setting_schedules: [],
  action_attempts: [],
  noise_thresholds: [],
  phone_invitations: [],
  phone_sdk_installations: [],

  _getNextId(type) {
    const count = (get()._counters[type] ?? 0) + 1
    set({ _counters: { ...get()._counters, [type]: count } })
    return `${type}${count}`
  },

  getNextRequestId() {
    return get()._getNextId("request")
  },

  setDevicedbConfig(devicedbConfig) {
    set({ devicedbConfig })
  },

  addWorkspace(params) {
    const pk_id = get()._getNextId("pk")
    const new_workspace = {
      workspace_id: params.workspace_id ?? get()._getNextId("workspace"),
      name: params.name,
      publishable_key:
        params.publishable_key ?? `seam_${pk_id}_${simpleHash(pk_id)}`,
      created_at: params.created_at ?? new Date().toISOString(),
      is_sandbox: params.is_sandbox ?? false,
      connect_partner_name: params.connect_partner_name ?? null,
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
      user_identifier_key: params.user_identifier_key ?? null,
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
    const connect_webview_id = get()._getNextId("connect_webview")
    const random_string = Math.random().toString(36).slice(-5)
    const new_connect_webview: ConnectWebview = {
      connect_webview_id,
      url: `https://${random_string}.fakeseamconnect.seam.vc/connect_webviews/view?connect_webview_id=${connect_webview_id}`,
      workspace_id: params.workspace_id,
      status: "pending",
      accepted_providers: params.accepted_providers ?? ["august"],
      created_at: params.created_at ?? new Date().toISOString(),
      custom_redirect_url: params.custom_redirect_url ?? null,
      custom_redirect_failure_url: params.custom_redirect_failure_url ?? null,
      device_selection_mode: params.device_selection_mode ?? "none",
      accepted_devices: params.accepted_devices ?? [],
      any_device_allowed: params.any_device_allowed ?? null,
      any_provider_allowed: params.any_provider_allowed ?? false,
      login_successful: params.login_successful ?? false,
      connected_account_id: params.connected_account_id ?? null,
      custom_metadata: params.custom_metadata ?? {},
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
        battery: {
          level: 1,
          status: "full",
          ...params.properties?.battery,
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

  deleteDevice(device_id) {
    const target = get().devices.find(
      (device) => device.device_id === device_id,
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

  updateDevice(params) {
    const target = get().devices.find(
      (device) => device.device_id === params.device_id,
    )
    if (target == null) {
      throw new Error("Could not find device with device_id")
    }

    const updated: Device = {
      ...target,
      ...params,
      properties: { ...target.properties, ...(params.properties ?? {}) },
    } as any

    set({
      devices: [
        ...get().devices.map((device) => {
          const is_target = device.device_id === target.device_id

          if (is_target) {
            return updated
          }

          return device
        }),
      ],
    })

    return updated
  },

  addConnectedAccount(params) {
    // @ts-expect-error  Partially implemented
    const new_connected_account: ConnectedAccount = {
      connected_account_id:
        params.connected_account_id ?? get()._getNextId("connected_account"),
      provider: params.provider,
      workspace_id: params.workspace_id,
      created_at: params.created_at ?? new Date().toISOString(),
      user_identifier: params.user_identifier ?? { email: "jane@example.com" },
    }

    set({
      connected_accounts: [...get().connected_accounts, new_connected_account],
    })

    return new_connected_account
  },

  deleteConnectedAccount(params) {
    const target = get().connected_accounts.find(
      (connected_account) =>
        connected_account.connected_account_id === params.connected_account_id,
    )
    if (target == null) {
      throw new Error(
        "Could not find connected_account with connected_account_id",
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
      is_one_time_use: false,
      is_offline_access_code: false,
      ...params,
      common_code_key:
        "common_code_key" in params ? params?.common_code_key ?? null : null,
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
      (access_code) => access_code.access_code_id === params.access_code_id,
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

  deleteAccessCode(access_code_id) {
    const target = get().access_codes.find(
      (access_code) => access_code.access_code_id === access_code_id,
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
        params.climate_setting_schedule_id,
    )
    if (target == null) {
      throw new Error(
        "Could not find climate_setting_schedule with climate_setting_schedule_id",
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

  deleteClimateSettingSchedule(climate_setting_schedule_id) {
    const target = get().climate_setting_schedules.find(
      (climate_setting_schedule) =>
        climate_setting_schedule.climate_setting_schedule_id ===
        climate_setting_schedule_id,
    )
    if (target == null) {
      throw new Error(
        "Could not find climate_setting_schedule with climate_setting_schedule_id",
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
          },
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
        action_attempt.action_attempt_id === params.action_attempt_id,
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

  addNoiseThreshold(params) {
    const noise_threshold: NoiseThreshold = {
      noise_threshold_id: get()._getNextId("noise_threshold"),
      noise_threshold_decibels: 70,
      name: "Fake Noise Threshold",
      ...params,
    }

    set({
      noise_thresholds: [...get().noise_thresholds, noise_threshold],
    })

    return noise_threshold
  },

  deleteNoiseThreshold({ device_id, noise_threshold_id }) {
    const target = get().noise_thresholds.find(
      (nt) =>
        nt.device_id === device_id &&
        nt.noise_threshold_id === noise_threshold_id,
    )
    if (target == null) {
      throw new Error(
        "Could not find noise_threshold with device_id and noise_threshold_id",
      )
    }

    set({
      noise_thresholds: [
        ...get().noise_thresholds.filter((nt) => {
          const is_target =
            nt.device_id === target.device_id &&
            nt.noise_threshold_id === target.noise_threshold_id

          return !is_target
        }),
      ],
    })
  },

  updateNoiseThreshold(params) {
    const target = get().noise_thresholds.find(
      (nt) =>
        nt.device_id === params.device_id &&
        nt.noise_threshold_id === params.noise_threshold_id,
    )
    if (target == null) {
      throw new Error(
        "Could not find noise_threshold with device_id and noise_threshold_id",
      )
    }

    const updated: NoiseThreshold = {
      ...target,
      ...params,
    }

    set({
      noise_thresholds: [
        ...get().noise_thresholds.map((nt) => {
          const is_target =
            nt.device_id === target.device_id &&
            nt.noise_threshold_id === target.noise_threshold_id

          if (is_target) {
            return updated
          }

          return nt
        }),
      ],
    })

    return updated
  },

  addEvent(params) {
    const new_event: Event = {
      event_id: get()._getNextId("event"),
      created_at: params?.created_at ?? new Date().toISOString(),
      occurred_at: params?.occurred_at ?? new Date().toISOString(),
      ...params,
    }

    set({
      events: [...get().events, new_event],
    })

    return new_event
  },

  getPhoneSdkInstallation(params) {
    return get().phone_sdk_installations.find(
      (installation) =>
        installation.workspace_id === params.workspace_id &&
        installation.phone_sdk_installation_id ===
          params.ext_sdk_installation_id,
    )
  },

  getInvitation(params) {
    return get().phone_invitations.find(
      (invitation) =>
        invitation.phone_sdk_installation_id ===
          params.phone_sdk_installation_id &&
        invitation.invitation_type === params.invitation_type &&
        invitation.invitation_id === params.invitation_id,
    )
  },

  update() {},
}))
