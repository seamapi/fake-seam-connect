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
        access_token_id: string
        access_token_short_token: string
        user_id: string
        workspace_id: string
        token: string
      }
    | {
        type: "access_token_without_workspace"
        access_token_id: string
        access_token_short_token: string
        user_id: string
        token: string
      }
    | {
        type: "client_session"
        client_session_id: string
        workspace_id: string
        publishable_key: string | null
        api_key_id: string | null
        method: "publishable_key" | "api_key"
        connect_webview_ids: string[]
        user_identity_ids: string[]
        connected_account_ids: string[]
        sandbox: boolean
      }
    | {
        type: "console_session_with_workspace"
        user_id: string
        user_session_id: string
        workspace_id: string
      }
    | {
        type: "console_session_without_workspace"
        user_id: string
        user_session_id: string
      }
}
