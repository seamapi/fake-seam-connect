export type Routes = {
  '/health': {
    route: '/health'
    method: 'GET'
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      note: string
      ok: boolean
    }
  }
  '/internal/client_sessions/create': {
    route: '/internal/client_sessions/create'
    method: 'POST' | 'PUT'
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
  Routes[Path]['jsonResponse']

export type RouteRequestBody<Path extends keyof Routes> =
  Routes[Path]['jsonBody'] & Routes[Path]['commonParams']

export type RouteRequestParams<Path extends keyof Routes> =
  Routes[Path]['queryParams'] & Routes[Path]['commonParams']
