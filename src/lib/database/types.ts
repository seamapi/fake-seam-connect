import type { HoistedMethodStoreApi } from 'zustand-hoist'

export interface DatabaseState {
  client_session_tokens: Array<ClientSessionToken>
}

export interface DatabaseMethods {
  update: (t?: number) => void
}

export type State = DatabaseState & DatabaseMethods

export type Database = HoistedMethodStoreApi<State>
