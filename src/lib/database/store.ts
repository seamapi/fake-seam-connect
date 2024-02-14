import { enableMapSet } from "immer"
import ms from "ms"
import { UnauthorizedException } from "nextlove"
import { immer } from "zustand/middleware/immer"
import { createStore, type StoreApi } from "zustand/vanilla"
import { hoist } from "zustand-hoist"

import { simpleHash } from "lib/util/simple-hash.ts"
import type { AccessCode } from "lib/zod/access_code.ts"
import type { AccessToken } from "lib/zod/access_token.ts"
import type { AcsSystem, AcsSystemExternalType } from "lib/zod/acs/system.ts"
import type { ActionAttempt } from "lib/zod/action_attempt.ts"
import type { ApiKey } from "lib/zod/api_key.ts"
import type {
  AssaAbloyCard,
  CredentialService,
} from "lib/zod/assa_abloy_credential_service.ts"
import type { ClientSession } from "lib/zod/client_session.ts"
import type { ClimateSettingSchedule } from "lib/zod/climate_setting_schedule.ts"
import type { ConnectWebview } from "lib/zod/connect_webview.ts"
import type { ConnectedAccount } from "lib/zod/connected_account.ts"
import type { Device } from "lib/zod/device.ts"
import type { Endpoint } from "lib/zod/endpoints.ts"
import type { EnrollmentAutomation } from "lib/zod/enrollment_automation.ts"
import type { Event } from "lib/zod/event.ts"
import type { NoiseThreshold } from "lib/zod/noise_threshold.ts"
import type { PhoneInvitation, PhoneSdkInstallation } from "lib/zod/phone.ts"
import type { UserIdentity } from "lib/zod/user_identity.ts"

import type { Database, ZustandDatabase } from "./schema.ts"
import { AcsUser, AcsUserExternalType } from "lib/zod/acs/users.ts"

const encodeAssaInvitationCode = ({
  invitation_id,
  phone_sdk_installation_id,
}: {
  invitation_id: string
  phone_sdk_installation_id: string
}) => `${invitation_id}:${phone_sdk_installation_id}`

const decodeAssaInvitationCode = (invitation_code: string) => {
  const parts = invitation_code.split(":")
  return {
    invitation_id: parts[0] ?? "",
    phone_sdk_installation_id: parts[1] ?? "",
  }
}

export const createDatabase = (): ZustandDatabase => {
  enableMapSet()
  return hoist<StoreApi<Database>>(createStore(initializer))
}

const initializer = immer<Database>((set, get) => ({
  _counters: {},
  devicedbConfig: null,
  simulatedWorkspaceOutages: {},
  simulatedEvents: {},
  client_sessions: [],
  assa_abloy_credential_services: [],
  assa_abloy_cards: [],
  endpoints: [],
  enrollment_automations: [],
  user_identities: [],
  workspaces: [],
  api_keys: [],
  access_tokens: [],
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
  acs_systems: [],
  acs_users: [],

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

  _addAssaAbloyCredentialService(params) {
    const cs_id = get()._getNextId("assa_cs")
    const new_credential_service: CredentialService = {
      service_id: cs_id,
      workspace_id: params.workspace_id,
    }

    set({
      assa_abloy_credential_services: [
        ...get().assa_abloy_credential_services,
        new_credential_service,
      ],
    })

    return new_credential_service
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

  resetSandboxWorkspace(workspace_id) {
    const db_state = get()
    const workspace = db_state.workspaces.find(
      (w) => w.workspace_id === workspace_id,
    )

    if (workspace == null) {
      throw new Error("Could not find workspace with workspace_id")
    }
    if (!workspace.is_sandbox) {
      throw new Error("Can only reset sandbox workspaces")
    }

    const ws_device_ids = db_state.devices
      .filter((device) => device.workspace_id === workspace_id)
      .map((device) => device.device_id)

    function filterByWorkspaceId<T extends { workspace_id: string }>(
      resource_collection: T[],
    ) {
      return [
        ...resource_collection.filter(
          (resource) => resource.workspace_id !== workspace_id,
        ),
      ]
    }

    function filterByDeviceIds<T extends { device_id: string }>(
      resource_collection: T[],
    ) {
      return [
        ...resource_collection.filter(
          (resource) => !ws_device_ids.includes(resource.device_id),
        ),
      ]
    }

    set({
      access_codes: filterByDeviceIds(db_state.access_codes),
      climate_setting_schedules: filterByDeviceIds(
        db_state.climate_setting_schedules,
      ),
      noise_thresholds: filterByDeviceIds(db_state.noise_thresholds),
      devices: filterByWorkspaceId(db_state.devices),
      client_sessions: filterByWorkspaceId(db_state.client_sessions),
      assa_abloy_credential_services: filterByWorkspaceId(
        db_state.assa_abloy_credential_services,
      ),
      phone_invitations: filterByWorkspaceId(db_state.phone_invitations),
      enrollment_automations: filterByWorkspaceId(
        db_state.enrollment_automations,
      ),
      user_identities: filterByWorkspaceId(db_state.user_identities),
      api_keys: filterByWorkspaceId(db_state.api_keys),
      connect_webviews: filterByWorkspaceId(db_state.connect_webviews),
      connected_accounts: filterByWorkspaceId(db_state.connected_accounts),
      events: filterByWorkspaceId(db_state.events),
      phone_sdk_installations: filterByWorkspaceId(
        db_state.phone_sdk_installations,
      ),
      endpoints: db_state.endpoints.filter((endpoint) => {
        const ws_credential_service_ids =
          db_state.assa_abloy_credential_services
            .filter((cs) => cs.workspace_id === workspace_id)
            .map((cs) => cs.service_id)

        return "assa_abloy_credential_service_id" in endpoint
          ? !ws_credential_service_ids.includes(
              endpoint.assa_abloy_credential_service_id,
            )
          : true
      }),
      workspaces: filterByWorkspaceId(db_state.workspaces),
    })
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

  addAccessToken(params) {
    const access_token_id = get()._getNextId("access_token")
    const user_id = get()._getNextId("user")

    const new_access_token: AccessToken = {
      access_token_id,
      email: params.email,
      user_id,
      access_token_name: params.access_token_name,
      long_token_hash: params.long_token_hash,
      short_token: params.short_token,
      created_at: params.created_at ?? new Date().toISOString(),
    }

    set({
      access_tokens: [...get().access_tokens, new_access_token],
    })

    return new_access_token
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
      user_identity_id: params.user_identity_id,
      created_at: params.created_at ?? new Date().toISOString(),
    }

    set({
      client_sessions: [...get().client_sessions, new_cst],
    })

    return new_cst
  },

  addUserIdentity(params) {
    const user_identity_id = params.user_identity_id ?? get()._getNextId("uid")
    const new_user_identity: UserIdentity = {
      workspace_id: params.workspace_id,
      user_identity_id,
      user_identity_key: params.user_identity_key ?? null,
      email_address: params.email_address ?? null,
      full_name: null,
      created_at: params.created_at ?? new Date().toISOString(),
    }

    set({
      user_identities: [...get().user_identities, new_user_identity],
    })

    return new_user_identity
  },

  addEnrollmentAutomation(params) {
    const enrollment_automation_id =
      params.enrollment_automation_id ??
      get()._getNextId("enrollment_automation")

    const new_enrollment_automation: EnrollmentAutomation = {
      workspace_id: params.workspace_id,
      enrollment_automation_id,
      assa_abloy_credential_service_id: params.assa_abloy_credential_service_id,
      user_identity_id: params.user_identity_id,
    }

    set({
      enrollment_automations: [
        ...get().enrollment_automations,
        new_enrollment_automation,
      ],
    })

    return new_enrollment_automation
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

  getClientSession(token) {
    return get().client_sessions.find((cst) => cst.token === token)
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
      any_device_allowed: params.any_device_allowed ?? false,
      any_provider_allowed: params.any_provider_allowed ?? false,
      login_successful: params.login_successful ?? false,
      connected_account_id: params.connected_account_id ?? null,
      custom_metadata: params.custom_metadata ?? {},
      automatically_manage_new_devices:
        params?.automatically_manage_new_devices ?? true,
      wait_for_device_creation: params?.wait_for_device_creation ?? false,
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
      account_type: params?.account_type,
      account_type_display_name: params?.account_type ?? "Unknown",
      automatically_manage_new_devices:
        params?.automatically_manage_new_devices ?? true,
    }

    if (params.provider === "assa_abloy_credential_service") {
      const service = get()._addAssaAbloyCredentialService({
        workspace_id: params.workspace_id,
      })

      new_connected_account.assa_abloy_credential_service_id =
        service.service_id
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

  updateConnectedAccount(params) {
    const target = get().connected_accounts.find(
      (connected_account) =>
        connected_account.connected_account_id === params.connected_account_id,
    )
    if (target == null) {
      throw new Error(
        "Could not find connected_account with connected_account_id",
      )
    }

    const updated: ConnectedAccount = {
      ...target,
      ...params,
      custom_metadata: {
        ...(target?.custom_metadata ?? {}),
        ...(params?.custom_metadata ?? {}),
      },
    }

    set({
      connected_accounts: [
        ...get().connected_accounts.map((connected_account) => {
          const is_target =
            connected_account.connected_account_id ===
            target.connected_account_id

          if (is_target) {
            return updated
          }

          return connected_account
        }),
      ],
    })

    return updated
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

  addEndpoint(params) {
    const endpoint: Endpoint = {
      endpoint_id: get()._getNextId("endpoint"),
      endpoint_type: "assa_abloy_credential_service",
      is_active: false,
      seos_tsm_endpoint_id: null,
      invitation_id: params.invitation_id,
      assa_abloy_credential_service_id: params.assa_abloy_credential_service_id,
    }

    set({
      endpoints: [...get().endpoints, endpoint],
    })

    return endpoint
  },

  activateEndpoint(params) {
    const endpoint = get().endpoints.find(
      (endpoint) => endpoint.endpoint_id === params.endpoint_id,
    )
    if (endpoint == null) {
      throw new Error("Could not find endpoint with endpoint_id")
    }

    if (endpoint.endpoint_type !== "assa_abloy_credential_service") {
      throw new Error(
        "Only activate assa_abloy_credential_service endpoint is implemented",
      )
    }

    const invitation = get().phone_invitations.find(
      (invitation) =>
        invitation.invitation_id === endpoint.invitation_id &&
        invitation.invitation_code === params.invitation_code,
    )

    if (invitation == null) {
      throw new Error("Could not find invitation with invitation_code")
    }

    set({
      endpoints: [
        ...get().endpoints.map((endpoint) => {
          const is_target = endpoint.endpoint_id === params.endpoint_id

          if (is_target) {
            return {
              ...endpoint,
              is_active: true,
            }
          }

          return endpoint
        }),
      ],
    })
  },

  addSimulatedReaderEvent(event) {
    const new_event = {
      ...event,
      timestamp: new Date().toISOString(),
    }

    set((state) => {
      if (state.simulatedEvents[event.reader_id] == null) {
        state.simulatedEvents[event.reader_id] = []
      }

      state.simulatedEvents[event.reader_id]?.push(new_event)
    })

    return new_event
  },

  addAssaAbloyCard(params) {
    const registration_number = get().assa_abloy_cards.length + 1

    // These are arbitrary values. Will need to update them when/if acs credentials is implemented
    const card: AssaAbloyCard = {
      cancelled: false,
      cardHolder: "",
      created: new Date().toISOString(),
      discarded: false,
      doorOperations: [
        {
          doors: ["1"],
          operation: "guest",
        },
      ],
      expireTime: new Date(Date.now() + ms("14 days")).toISOString(),
      endpointId: params.endpoint_id,

      expired: false,
      format: "rfid48",
      id: registration_number.toString(),
      notIssued: false,
      numberOfIssuedCards: registration_number,
      overridden: false,
      overwritten: false,
      pendingAutoUpdate: false,
      serialNumbers: ["1"],
      startTime: new Date().toISOString(),
      uniqueRegistrationNumber: registration_number,
      credentialID: registration_number,
    }

    set({
      assa_abloy_cards: [...get().assa_abloy_cards, card],
    })

    return card
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

  addPhoneSdkInstallation(params) {
    const client_session = get().client_sessions.find(
      (cs) => cs.client_session_id === params.client_session_id,
    )

    if (client_session?.user_identity_id === undefined) {
      throw new Error(
        "Could not find client session associated with a user identity!",
      )
    }

    const device = get().addDevice({
      workspace_id: params.workspace_id,
      device_type: "android_phone",
      name: "Android Phone",
    })

    const installation_id = get()._getNextId("sdk_installation")
    const new_installation: PhoneSdkInstallation = {
      device_id: device.device_id,
      ext_sdk_installation_id: params.ext_sdk_installation_id,
      phone_sdk_installation_id: installation_id,
      workspace_id: params.workspace_id,
      user_identity_id: client_session.user_identity_id,
    }

    set({
      phone_sdk_installations: [
        ...get().phone_sdk_installations,
        new_installation,
      ],
    })
    return new_installation
  },

  getPhoneSdkInstallation(params) {
    const client_session = get().client_sessions.find(
      (cs) => cs.client_session_id === params.client_session_id,
    )

    if (client_session === undefined) {
      return
    }

    return get().phone_sdk_installations.find(
      (installation) =>
        installation.workspace_id === params.workspace_id &&
        installation.user_identity_id === client_session.user_identity_id &&
        installation.ext_sdk_installation_id === params.ext_sdk_installation_id,
    )
  },

  addInvitation(params) {
    const client_session = get().client_sessions.find(
      (cs) => cs.client_session_id === params.client_session_id,
    )

    if (client_session?.user_identity_id === undefined) {
      throw new Error(
        "Could not find client session associated with a user identity!",
      )
    }

    const invitation_id = get()._getNextId("invitation")
    const new_invitation: PhoneInvitation = {
      invitation_id,
      invitation_type: params.invitation_type,
      invitation_code: params.invitation_code,
      phone_sdk_installation_id: params.phone_sdk_installation_id,
      workspace_id: params.workspace_id,
      user_identity_id: client_session.user_identity_id,

      assa_abloy_credential_service_id: params.assa_abloy_credential_service_id,
    }

    set({
      phone_invitations: [...get().phone_invitations, new_invitation],
    })
    return new_invitation
  },

  assignInvitationCode(params) {
    const invitation = get().phone_invitations.find(
      (invitation) => invitation.invitation_id === params.invitation_id,
    )

    if (invitation === undefined) {
      throw new Error("Could not find invitation!")
    }

    const updated_invitation = {
      ...invitation,
      invitation_code: encodeAssaInvitationCode(invitation),
    }

    set({
      phone_invitations: [
        ...get().phone_invitations.filter(
          (invitation) =>
            invitation.invitation_id !== updated_invitation.invitation_id,
        ),
        updated_invitation,
      ],
    })

    return updated_invitation
  },

  getEnrollmentAutomations(params) {
    const client_session = get().client_sessions.find(
      (cs) => cs.client_session_id === params.client_session_id,
    )

    if (client_session?.user_identity_id === undefined) {
      throw new Error(
        "Could not find client session associated with a user identity!",
      )
    }

    return get().enrollment_automations.filter(
      (automation) =>
        automation.user_identity_id === client_session.user_identity_id,
    )
  },

  getInvitationByCode(params) {
    const { invitation_id, phone_sdk_installation_id } =
      decodeAssaInvitationCode(params.invitation_code)

    return get().phone_invitations.find(
      (invitation) =>
        invitation.phone_sdk_installation_id === phone_sdk_installation_id &&
        invitation.invitation_id === invitation_id,
    )
  },

  getInvitations(params) {
    const client_session = get().client_sessions.find(
      (cs) => cs.client_session_id === params.client_session_id,
    )

    if (client_session?.user_identity_id === undefined) {
      throw new UnauthorizedException({
        type: "unassociated_session",
        message:
          "Could not find client session associated with a user identity!",
      })
    }

    return get().phone_invitations.filter(
      (invitation) =>
        invitation.phone_sdk_installation_id ===
          params.phone_sdk_installation_id &&
        invitation.user_identity_id === client_session.user_identity_id,
    )
  },

  getEndpoints(params) {
    const client_session = get().client_sessions.find(
      (cs) => cs.client_session_id === params.client_session_id,
    )

    if (client_session?.user_identity_id === undefined) {
      throw new Error(
        "Could not find client session associated with a user identity!",
      )
    }

    const invitations = get().phone_invitations.filter(
      (invitation) =>
        invitation.phone_sdk_installation_id ===
          params.phone_sdk_installation_id &&
        invitation.user_identity_id === client_session.user_identity_id,
    )

    return get().endpoints.filter(
      (endpoint) =>
        endpoint.endpoint_type === "assa_abloy_credential_service" &&
        invitations.some(
          (invitation) =>
            invitation.invitation_id === endpoint.invitation_id &&
            invitation.assa_abloy_credential_service_id ===
              endpoint.assa_abloy_credential_service_id,
        ),
    )
  },

  addAcsSystem({
    external_type,
    name,
    workspace_id,
    created_at,
    connected_account_ids,
  }) {
    const SYSTEM_TYPE_TO_DISPLAY_NAME: Record<AcsSystemExternalType, string> = {
      pti_site: "PTI site",
      alta_org: "Alta org",
      brivo_account: "Brivo account",
      salto_site: "Salto site",
      hid_credential_manager_organization: "HID org",
      visionline_system: "Visionline",
      assa_abloy_credential_service: "Assa Abloy Credential Service",
    }

    const new_acs_system: AcsSystem = {
      acs_system_id: get()._getNextId("acs_system"),
      name,
      workspace_id,
      created_at: created_at ?? new Date().toISOString(),
      system_type: external_type,
      system_type_display_name: SYSTEM_TYPE_TO_DISPLAY_NAME[external_type],
      external_type,
      external_type_display_name: SYSTEM_TYPE_TO_DISPLAY_NAME[external_type],
      connected_account_ids: connected_account_ids ?? [],
    }

    set({
      acs_systems: [...get().acs_systems, new_acs_system],
    })

    return new_acs_system
  },

  addAcsUser({
    external_type,
    workspace_id,
    created_at,
    acs_system_id,
    email,
    email_address,
    full_name,
    is_suspended,
    access_schedule,
    display_name,
    hid_acs_system_id,
    phone_number,
    user_identity_email_address,
    user_identity_id,
    user_identity_phone_number,
  }) {
    const USER_TYPE_TO_DISPLAY_NAME: Record<AcsUserExternalType, string> = {
      pti_user: "PTI user",
      brivo_user: "Brivo user",
      hid_credential_manager_user: "HID user",
      salto_site_user: "Salto site user",
    }

    const acs_user_id = get()._getNextId("acs_user")
    const user_email =
      email ??
      email_address ??
      `acs_user_${simpleHash(acs_user_id)}@example.com`
    const user_full_name = full_name ?? "Fake ACS User"

    const new_acs_user: AcsUser = {
      acs_user_id,
      acs_system_id,
      workspace_id,
      full_name: user_full_name ?? "Fake ACS User",
      display_name:
        display_name ?? user_full_name ?? user_email ?? "Fake Unnamed User",
      email: user_email,
      email_address: user_email,
      created_at: created_at ?? new Date().toISOString(),
      is_suspended: is_suspended ?? false,
      ...(access_schedule != null && { access_schedule }),
      ...(external_type != null && {
        external_type,
        external_type_display_name: USER_TYPE_TO_DISPLAY_NAME[external_type],
      }),
      ...(hid_acs_system_id != null && { hid_acs_system_id }),
      ...(phone_number != null && { phone_number }),
      ...(user_identity_email_address != null && {
        user_identity_email_address,
      }),
      ...(user_identity_id != null && { user_identity_id }),
      ...(user_identity_phone_number != null && { user_identity_phone_number }),
    }

    set({
      acs_users: [...get().acs_users, new_acs_user],
    })

    return new_acs_user
  },

  update() {},
}))
