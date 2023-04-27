import type { HoistedMethodStoreApi } from 'zustand-hoist'
import type { Device, ClientSessionToken } from 'lib/zod/index.ts'

export type WorkspaceId = string

export interface DatabaseState {
  workspaces: Record<
    WorkspaceId,
    {
      client_session_tokens: Array<ClientSessionToken>
      devices: Array<Device>
    }
  >
}

export interface DatabaseMethods {
  addClientSessionToken(params: {
    workspace_id: WorkspaceId
    connected_account_ids: string[]
    connect_webview_ids: string[]
  }): ClientSessionToken
  update: (t?: number) => void
}

export type State = DatabaseState & DatabaseMethods

export type Database = HoistedMethodStoreApi<State>
