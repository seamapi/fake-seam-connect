import type {
  Device,
  ClientSession,
  Workspace,
  ConnectWebview,
  ConnectedAccount,
} from "lib/zod/index.ts"

export type WorkspaceId = string

export interface DatabaseState {
  _counters: Record<string, number>
  workspaces: Workspace[]
  connect_webviews: ConnectWebview[]
  client_sessions: ClientSession[]
  connected_accounts: ConnectedAccount[]
  devices: Device[]
}

export interface DatabaseMethods {
  _getNextId(type: string): string
  addWorkspace(params: { name: string }): Workspace
  addClientSessionToken(params: {
    workspace_id: WorkspaceId
    connected_account_ids?: string[]
    connect_webview_ids?: string[]
    user_identifier_key?: string
  }): ClientSession
  addConnectWebview(params: { workspace_id: WorkspaceId }): ConnectWebview
  updateConnectWebview(params: {
    connect_webview_id: string
    status: string
  }): void

  addConnectedAccount(params: { provider: string }): ConnectedAccount
  addDevice(params: { device_type: string }): Device

  update: (t?: number) => void
}

export type Database = DatabaseState & DatabaseMethods
