import type { HoistedStoreApi } from "zustand-hoist"

import type {
  AccessCode,
  ApiKey,
  ClientSession,
  ClimateSettingSchedule,
  ConnectedAccount,
  ConnectWebview,
  Device,
  Workspace,
} from "lib/zod/index.ts"

import type { ClimateSetting } from "lib/zod/climate_setting.ts"

export type WorkspaceId = string

export interface DatabaseState {
  _counters: Record<string, number>
  workspaces: Workspace[]
  api_keys: ApiKey[]
  access_codes: AccessCode[]
  connect_webviews: ConnectWebview[]
  client_sessions: ClientSession[]
  connected_accounts: ConnectedAccount[]
  devices: Device[]
  climate_setting_schedules: ClimateSettingSchedule[]
}

export interface DatabaseMethods {
  _getNextId: (type: string) => string
  addWorkspace: (params: {
    name: string
    publishable_key?: string
    created_at?: string
    workspace_id?: string
  }) => Workspace
  addApiKey: (params: {
    name?: string
    token?: string
    created_at?: string
  }) => ApiKey
  addClientSession: (params: {
    workspace_id: WorkspaceId
    connected_account_ids?: string[]
    connect_webview_ids?: string[]
    user_identifier_key?: string
    token?: string
    created_at?: string
  }) => ClientSession
  updateClientSession: (params: {
    client_session_id: string
    connected_account_ids?: string[]
    connect_webview_ids?: string[]
  }) => void

  addConnectWebview: (params: {
    workspace_id: WorkspaceId
    connect_webview_id?: string
    created_at?: string
  }) => ConnectWebview
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
  addDevice: (params: {
    device_id?: string
    device_type: Device["device_type"]
    connected_account_id: string
    workspace_id: string
    name: string
    properties?: Omit<Partial<Device["properties"]>, "model"> & {
      model?: Partial<Device["properties"]["model"]>
    }
    errors?: Device["errors"]
    warnings?: Device["warnings"]
    created_at?: string
  }) => Device
  addAccessCode: (
    params: {
      workspace_id: string
      name: string
      code: string
      device_id: string
      created_at?: string
    } & Partial<AccessCode>
  ) => AccessCode
  findAccessCode: (params: {
    access_code_id: string
    device_id?: string
  }) => AccessCode | undefined
  updateAccessCode: (params: Partial<AccessCode>) => AccessCode
  deleteAccessCode: (params: AccessCode) => void
  setPulledBackupAccessCodeId: (params: {
    original_access_code_id: string
    pulled_backup_access_code_id: string
  }) => void
  addClimateSettingSchedule: (
    params: {
      workspace_id: string
      device_id: string
      schedule_type: ClimateSettingSchedule["schedule_type"]
      schedule_starts_at: string
      schedule_ends_at: string
      created_at?: string
      name: string
    } & Partial<ClimateSetting>
  ) => ClimateSettingSchedule

  update: (t?: number) => void
}

export type Database = DatabaseState & DatabaseMethods

export type ZustandDatabase = HoistedStoreApi<Database>
