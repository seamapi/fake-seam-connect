export type AuthenticatedRequest = Request & {
  auth:
    | {
        type: "api_key"
        workspace_id: string
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
        connected_account_ids: string[]
        workspace_id: string
        publishable_key: string | null
        client_session_id: string
        connect_webview_ids: string[]
        method: "publishable_key" | "api_key"
      }
    | {
        type: "user_session"
        workspace_id: string
        user_id: string
      }
    | {
        type: "user_session_without_workspace"
        user_id: string
      }
}
