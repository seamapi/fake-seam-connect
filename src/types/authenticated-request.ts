export type AuthenticatedRequest = Request & {
  auth:
    | {
        type: "api_key"
        api_key_id: string
        api_key_short_token: string
        workspace_id: string
        token: string
      }
    | {
        type: "access_token"
        workspace_id: string
      }
    | {
        type: "access_token_without_workspace"
        user_id: string
      }
    | {
        type: "client_session"
        client_session_id: string
        workspace_id: string
        publishable_key: string | null
        api_key_id: string | null
        method: "publishable_key" | "api_key"
        connected_account_ids: string[]
        connect_webview_ids: string[]
        user_identity_ids: string[]
        third_party_account_ids: string[]
        sandbox: boolean
      }
    | {
        type: "user_session"
        user_id: string
        user_session_id: string
        workspace_id: string
      }
    | {
        type: "user_session_without_workspace"
        user_id: string
        user_session_id: string
      }
}
