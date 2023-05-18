import { type StoreApi } from "zustand/vanilla"

import type {
  AccessCode,
  ClientSession,
  ConnectedAccount,
  ConnectWebview,
  Device,
  Workspace,
} from "lib/zod/index.ts"

export type WorkspaceId = string

export interface DatabaseState {
  _counters: Record<string, number>
  workspaces: Workspace[]
  access_codes: AccessCode[]
  connect_webviews: ConnectWebview[]
  client_sessions: ClientSession[]
  connected_accounts: ConnectedAccount[]
  devices: Device[]
}

export interface DatabaseMethods {
  _getNextId(type: string): string
  addWorkspace(params: { name: string; publishable_key?: string }): Workspace
  addClientSession(params: {
    workspace_id: WorkspaceId
    connected_account_ids?: string[]
    connect_webview_ids?: string[]
    user_identifier_key?: string
    token?: string
  }): ClientSession
  updateClientSession(params: {
    client_session_id: string
    connected_account_ids?: string[]
    connect_webview_ids?: string[]
  }): void

  addConnectWebview(params: { workspace_id: WorkspaceId }): ConnectWebview
  updateConnectWebview(params: {
    connect_webview_id: string
    connected_account_id: string
    status: "pending" | "authorized" | "failed"
  }): void

  addConnectedAccount(params: {
    provider: string
    workspace_id: string
  }): ConnectedAccount
  addDevice(params: {
    device_type: Device["device_type"]
    connected_account_id: string
    workspace_id: string
    name: string
    properties?: Partial<Device["properties"]>
  }): Device
  addAccessCode(
    params: {
      workspace_id: string
      name: string
      code: string
      device_id: string
    } & Partial<AccessCode>
  ): AccessCode

  update: (t?: number) => void
}

export type Database = DatabaseState &
  DatabaseMethods &
  StoreApi<DatabaseState & DatabaseMethods>
