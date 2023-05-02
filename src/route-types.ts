export type Routes = {
  "/access_codes/create": {
    route: "/access_codes/create"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      name?: string | undefined
      code?: string | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      access_code: {
        access_code_id: string
        device_id: string
        name: string
        code: string
        created_at: string
      }
    }
  }
  "/access_codes/list": {
    route: "/access_codes/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      access_codes: {
        access_code_id: string
        device_id: string
        name: string
        code: string
        created_at: string
      }[]
    }
  }
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
  "/connect_webviews/get": {
    route: "/connect_webviews/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      connect_webview_id: string
    }
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
  "/connected_accounts/get": {
    route: "/connected_accounts/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      connected_account_id: string
    }
    formData: {}
    jsonResponse: {
      connected_account: {
        connected_account_id: string
        workspace_id: string
        connect_webview_id: string
        provider: string
        created_at: string
      }
    }
  }
  "/connected_accounts/list": {
    route: "/connected_accounts/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      connected_accounts: {
        connected_account_id: string
        workspace_id: string
        connect_webview_id: string
        provider: string
        created_at: string
      }[]
    }
  }
  "/devices/get": {
    route: "/devices/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
    }
    formData: {}
    jsonResponse: {
      device: {
        device_id: string
        device_type: "august_lock"
        capabilities_supported: string[]
        properties: {
          online: boolean
          name: string
        }
        location?: any
        connected_account_id: string
        workspace_id: string
        errors: {
          error_code: string
          message: string
        }[]
        warnings: {
          warning_code: string
          message: string
        }[]
        created_at: string
      }
    }
  }
  "/devices/list": {
    route: "/devices/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      devices: {
        device_id: string
        device_type: "august_lock"
        capabilities_supported: string[]
        properties: {
          online: boolean
          name: string
        }
        location?: any
        connected_account_id: string
        workspace_id: string
        errors: {
          error_code: string
          message: string
        }[]
        warnings: {
          warning_code: string
          message: string
        }[]
        created_at: string
      }[]
    }
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
        client_session_id: string
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
