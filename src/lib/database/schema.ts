import type { Routes } from "@seamapi/fake-seam-connect"
import type { HoistedStoreApi } from "zustand-hoist"

import type {
  AccessCode,
  ActionAttempt,
  ApiKey,
  ClientSession,
  ClimateSettingSchedule,
  ConnectedAccount,
  ConnectWebview,
  Device,
  Event,
  NoiseThreshold,
  PhoneInvitation,
  PhoneSdkInstallation,
  Workspace,
} from "lib/zod/index.ts"

import type { RecursivePartial } from "lib/util/type-helpers.ts"
import type { ClimateSetting } from "lib/zod/climate_setting.ts"

export type WorkspaceId = string

export interface DatabaseState {
  _counters: Record<string, number>
  devicedbConfig: DevicedbConfig | null
  workspaces: Workspace[]
  api_keys: ApiKey[]
  access_codes: AccessCode[]
  connect_webviews: ConnectWebview[]
  client_sessions: ClientSession[]
  connected_accounts: ConnectedAccount[]
  devices: Device[]
  events: Event[]
  climate_setting_schedules: ClimateSettingSchedule[]
  action_attempts: ActionAttempt[]
  noise_thresholds: NoiseThreshold[]
  simulatedWorkspaceOutages: Record<
    string,
    { workspace_id: string; routes: Array<keyof Routes> } | undefined
  >
  phone_invitations: PhoneInvitation[]
  phone_sdk_installations: PhoneSdkInstallation[]
}

export interface DatabaseMethods {
  _getNextId: (type: string) => string
  getNextRequestId: () => string
  setDevicedbConfig: (devicedbConfig: DevicedbConfig) => void
  addWorkspace: (params: {
    name: string
    publishable_key?: string
    created_at?: string
    workspace_id?: string
    is_sandbox?: boolean
    connect_partner_name?: string
  }) => Workspace
  addApiKey: (params: {
    name?: string
    token?: string
    created_at?: string
    workspace_id: string
  }) => ApiKey
  addClientSession: (params: {
    workspace_id: WorkspaceId
    connected_account_ids?: string[]
    connect_webview_ids?: string[]
    user_identifier_key: string
    token?: string
    created_at?: string
  }) => ClientSession
  updateClientSession: (params: {
    client_session_id: string
    connected_account_ids?: string[]
    connect_webview_ids?: string[]
  }) => void

  addConnectWebview: (
    params: Partial<ConnectWebview> & Pick<ConnectWebview, "workspace_id">,
  ) => ConnectWebview
  updateConnectWebview: (params: {
    connect_webview_id: string
    connected_account_id: string
    status: "pending" | "authorized" | "failed"
  }) => void

  addConnectedAccount: (params: {
    provider: string
    workspace_id: string
    user_identifier: ConnectedAccount["user_identifier"]
    connected_account_id?: string
    created_at?: string
  }) => ConnectedAccount
  deleteConnectedAccount: (
    params: Pick<ConnectedAccount, "connected_account_id">,
  ) => void
  addDevice: (params: {
    device_id?: string
    device_type: Device["device_type"]
    connected_account_id: string
    workspace_id: string
    name: string
    properties?: Partial<Device["properties"]>
    errors?: Device["errors"]
    warnings?: Device["warnings"]
    created_at?: string
  }) => Device
  deleteDevice: (device_id: Device["device_id"]) => void
  updateDevice: (
    params: Pick<Device, "device_id"> & RecursivePartial<Device>,
  ) => Device
  addAccessCode: (
    params: {
      workspace_id: string
      name: string
      code: string
      device_id: string
      created_at?: string
    } & Partial<AccessCode>,
  ) => AccessCode
  findAccessCode: (params: {
    access_code_id: string
    device_id?: string
  }) => AccessCode | undefined
  updateAccessCode: (
    params: Pick<AccessCode, "access_code_id"> & Partial<AccessCode>,
  ) => AccessCode
  deleteAccessCode: (access_code_id: AccessCode["access_code_id"]) => void
  setPulledBackupAccessCodeId: (params: {
    original_access_code_id: string
    pulled_backup_access_code_id: string
  }) => void
  findClimateSettingSchedule: (params: {
    climate_setting_schedule_id: string
    device_id?: string
  }) => ClimateSettingSchedule | undefined
  addClimateSettingSchedule: (
    params: {
      workspace_id: string
      device_id: string
      schedule_type: ClimateSettingSchedule["schedule_type"]
      schedule_starts_at: string
      schedule_ends_at: string
      created_at?: string
      name: string
    } & Partial<ClimateSetting>,
  ) => ClimateSettingSchedule
  updateClimateSettingSchedule: (
    params: Pick<ClimateSettingSchedule, "climate_setting_schedule_id"> &
      Partial<ClimateSettingSchedule>,
  ) => ClimateSettingSchedule
  deleteClimateSettingSchedule: (
    climate_setting_schedule_id: ClimateSettingSchedule["climate_setting_schedule_id"],
  ) => void

  addActionAttempt: (params: Partial<ActionAttempt>) => ActionAttempt
  findActionAttempt: (
    params: Pick<ActionAttempt, "action_attempt_id">,
  ) => ActionAttempt | undefined
  updateActionAttempt: (
    params: Partial<ActionAttempt> & Pick<ActionAttempt, "action_attempt_id">,
  ) => ActionAttempt

  simulateWorkspaceOutage: (
    workspace_id: string,
    context: {
      routes: Array<keyof Routes>
    },
  ) => void
  simulateWorkspaceOutageRecovery: (workspace_id: string) => void

  addNoiseThreshold: (
    params: Pick<
      NoiseThreshold,
      "device_id" | "starts_daily_at" | "ends_daily_at"
    > &
      Partial<NoiseThreshold>,
  ) => NoiseThreshold
  deleteNoiseThreshold: (
    params: Pick<NoiseThreshold, "noise_threshold_id" | "device_id">,
  ) => void
  updateNoiseThreshold: (
    params: Pick<NoiseThreshold, "device_id" | "noise_threshold_id"> &
      Partial<NoiseThreshold>,
  ) => NoiseThreshold

  addEvent: (
    params: Partial<Event> & Pick<Event, "event_type" | "workspace_id">,
  ) => Event

  getPhoneSdkInstallation: (
    params: Pick<
      PhoneSdkInstallation,
      "workspace_id" | "ext_sdk_installation_id"
    >,
  ) => PhoneSdkInstallation | undefined

  getInvitation: (
    params: Pick<
      PhoneInvitation,
      "phone_sdk_installation_id" | "invitation_id" | "invitation_type"
    >,
  ) => PhoneInvitation | undefined

  update: (t?: number) => void
}

interface DevicedbConfig {
  url: string
  vercelProtectionBypassSecret: string
}

export type Database = DatabaseState & DatabaseMethods

export type ZustandDatabase = HoistedStoreApi<Database>
