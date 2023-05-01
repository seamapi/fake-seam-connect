import type {
  Device,
  ClientSessionToken,
  Workspace,
  ConnectWebview,
  ConnectedAccount,
} from 'lib/zod/index.ts'

export type WorkspaceId = string

export interface DatabaseState {
  _counters: Record<string, number>
  workspaces: Workspace[]
  connect_webviews: ConnectWebview[]
  client_session_tokens: ClientSessionToken[]
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
  }): ClientSessionToken
  update: (t?: number) => void
}

export type Database = DatabaseState & DatabaseMethods
