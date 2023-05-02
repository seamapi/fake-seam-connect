export type Routes = {
  "/connect_webviews/create": {
    route: "/connect_webviews/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      accepted_providers?: string[] | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      connect_webview: {
        connect_webview_id: string
        workspace_id: string
        status: "pending" | "authorized" | "failed"
        accepted_providers?: string[] | undefined
        connected_account_id?: string | undefined
        created_at: string
      }
    }
  }
  "/connect_webviews/view": {
    route: "/connect_webviews/view"
    method: "GET"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {}
  }
  "/fake_only/complete_connect_webview": {
    route: "/fake_only/complete_connect_webview"
    method: "POST"
    queryParams: {}
    jsonBody: {
      connect_webview_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {}
  }
  "/health": {
    route: "/health"
    method: "GET"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      note: string
      ok: boolean
    }
  }
  "/internal/client_sessions/create": {
    route: "/internal/client_sessions/create"
    method: "POST" | "PUT"
    queryParams: {}
    jsonBody: {
      connected_account_ids?: string[] | undefined
      connect_webview_ids?: string[] | undefined
      user_identifier_key?: string | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      client_session: {
        client_session_token_id: string
        workspace_id: string
        token: string
        short_token: string
        long_token: string
        user_identifier_key: string
        connect_webview_ids: string[]
        connected_account_ids: string[]
        created_at: string
      }
      ok: true
    }
  }
}

export type RouteResponse<Path extends keyof Routes> =
  Routes[Path]["jsonResponse"]

export type RouteRequestBody<Path extends keyof Routes> =
  Routes[Path]["jsonBody"] & Routes[Path]["commonParams"]

export type RouteRequestParams<Path extends keyof Routes> =
  Routes[Path]["queryParams"] & Routes[Path]["commonParams"]
