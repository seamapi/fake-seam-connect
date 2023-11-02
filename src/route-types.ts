export type Routes = {
  "/_fake/complete_connect_webview": {
    route: "/_fake/complete_connect_webview"
    method: "POST"
    queryParams: {}
    jsonBody: {
      connect_webview_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/_fake/database": {
    route: "/_fake/database"
    method: "GET" | "PUT" | "POST"
    queryParams: {}
    jsonBody: any | undefined
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/access_codes/create": {
    route: "/access_codes/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      name?: string | undefined
      code?: string | undefined
      starts_at?: (string | Date) | undefined
      ends_at?: (string | Date) | undefined
      use_backup_access_code_pool?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      access_code:
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "ongoing"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "time_bound"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
            starts_at: string
            ends_at: string
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set"
            created_at: string
            type: "ongoing"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set" | "unset"
            created_at: string
            type: "time_bound"
            starts_at: string
            ends_at: string
          }
      ok: boolean
    }
  }
  "/access_codes/create_multiple": {
    route: "/access_codes/create_multiple"
    method: "POST"
    queryParams: {}
    jsonBody: {
      device_ids: string[]
      behavior_when_code_cannot_be_shared?: "throw" | "create_random_code"
      name?: string | undefined
      code?: string | undefined
      starts_at?: (string | Date) | undefined
      ends_at?: (string | Date) | undefined
      use_backup_access_code_pool?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      access_codes: (
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "ongoing"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "time_bound"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
            starts_at: string
            ends_at: string
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set"
            created_at: string
            type: "ongoing"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set" | "unset"
            created_at: string
            type: "time_bound"
            starts_at: string
            ends_at: string
          }
      )[]
      ok: boolean
    }
  }
  "/access_codes/delete": {
    route: "/access_codes/delete"
    method: "POST" | "DELETE"
    queryParams: {}
    jsonBody: {
      access_code_id: string
      device_id?: string | undefined
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/access_codes/generate_code": {
    route: "/access_codes/generate_code"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
    }
    formData: {}
    jsonResponse: {
      generated_code: {
        device_id: string
        code: string
      }
      ok: boolean
    }
  }
  "/access_codes/get": {
    route: "/access_codes/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id?: string | undefined
      access_code_id?: string | undefined
      code?: string | undefined
    }
    formData: {}
    jsonResponse: {
      access_code:
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "ongoing"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "time_bound"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
            starts_at: string
            ends_at: string
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set"
            created_at: string
            type: "ongoing"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set" | "unset"
            created_at: string
            type: "time_bound"
            starts_at: string
            ends_at: string
          }
      ok: boolean
    }
  }
  "/access_codes/list": {
    route: "/access_codes/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id?: string | undefined
      access_code_ids?: string[] | undefined
    }
    formData: {}
    jsonResponse: {
      access_codes: (
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "ongoing"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "time_bound"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
            starts_at: string
            ends_at: string
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set"
            created_at: string
            type: "ongoing"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set" | "unset"
            created_at: string
            type: "time_bound"
            starts_at: string
            ends_at: string
          }
      )[]
      ok: boolean
    }
  }
  "/access_codes/pull_backup_access_code": {
    route: "/access_codes/pull_backup_access_code"
    method: "POST"
    queryParams: {}
    jsonBody: {
      access_code_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      backup_access_code:
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "ongoing"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "time_bound"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
            starts_at: string
            ends_at: string
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set"
            created_at: string
            type: "ongoing"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set" | "unset"
            created_at: string
            type: "time_bound"
            starts_at: string
            ends_at: string
          }
      ok: boolean
    }
  }
  "/access_codes/simulate/create_unmanaged_access_code": {
    route: "/access_codes/simulate/create_unmanaged_access_code"
    method: "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      name: string
      code: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      access_code:
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "ongoing"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "time_bound"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
            starts_at: string
            ends_at: string
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set"
            created_at: string
            type: "ongoing"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set" | "unset"
            created_at: string
            type: "time_bound"
            starts_at: string
            ends_at: string
          }
      ok: boolean
    }
  }
  "/access_codes/unmanaged/list": {
    route: "/access_codes/unmanaged/list"
    method: "GET" | "POST"
    queryParams: {
      device_id: string
    }
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      access_codes: (
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "ongoing"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            common_code_key?: (string | null) | undefined
            type: "time_bound"
            created_at: string
            status: "setting" | "set" | "removing" | "unset" | "unknown"
            starts_at: string
            ends_at: string
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set"
            created_at: string
            type: "ongoing"
          }
        | {
            access_code_id: string
            device_id: string
            name: string
            code: string
            errors: {
              error_code: string
              message: string
            }[]
            warnings: {
              warning_code: string
              message: string
            }[]
            is_managed: boolean
            is_backup?: boolean | undefined
            pulled_backup_access_code_id?: (string | null) | undefined
            is_backup_access_code_available: boolean
            is_external_modification_allowed: boolean
            status: "set" | "unset"
            created_at: string
            type: "time_bound"
            starts_at: string
            ends_at: string
          }
      )[]
      ok: boolean
    }
  }
  "/access_codes/unmanaged/update": {
    route: "/access_codes/unmanaged/update"
    method: "POST" | "PATCH"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      access_code_id: string
      is_managed: boolean
      allow_external_modification?: boolean | undefined
      force?: boolean | undefined
    }
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/access_codes/update": {
    route: "/access_codes/update"
    method: "POST"
    queryParams: {}
    jsonBody: {
      access_code_id: string
      device_id?: string | undefined
      name?: string | undefined
      code?: string | undefined
      starts_at?: (string | Date) | undefined
      ends_at?: (string | Date) | undefined
      type?: ("ongoing" | "time_bound") | undefined
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/action_attempts/get": {
    route: "/action_attempts/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      action_attempt_id: string
    }
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/action_attempts/list": {
    route: "/action_attempts/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      action_attempt_ids: string[]
    }
    formData: {}
    jsonResponse: {
      action_attempts: (
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      )[]
      ok: boolean
    }
  }
  "/client_sessions/create": {
    route: "/client_sessions/create"
    method: "POST" | "PUT"
    queryParams: {}
    jsonBody:
      | any
      | (
          | {
              connected_account_ids?: string[] | undefined
              connect_webview_ids?: string[] | undefined
              user_identifier_key?: string | undefined
            }
          | undefined
        )
    commonParams: {}
    formData: {}
    jsonResponse: {
      client_session: {
        client_session_id: string
        workspace_id: string
        token: string
        user_identifier_key: string
        connect_webview_ids: string[]
        connected_account_ids: string[]
        created_at: string
      }
      ok: boolean
    }
  }
  "/client_sessions/get": {
    route: "/client_sessions/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      client_session_id?: string | undefined
      user_identifier_key?: string | undefined
    }
    formData: {}
    jsonResponse: {
      client_session: {
        client_session_id: string
        workspace_id: string
        token: string
        user_identifier_key: string
        connect_webview_ids: string[]
        connected_account_ids: string[]
        created_at: string
      }
      ok: boolean
    }
  }
  "/client_sessions/get_or_create": {
    route: "/client_sessions/get_or_create"
    method: "POST" | "PUT"
    queryParams: {}
    jsonBody:
      | any
      | (
          | {
              connected_account_ids?: string[] | undefined
              connect_webview_ids?: string[] | undefined
              user_identifier_key?: string | undefined
            }
          | undefined
        )
    commonParams: {}
    formData: {}
    jsonResponse: {
      client_session: {
        client_session_id: string
        workspace_id: string
        token: string
        user_identifier_key: string
        connect_webview_ids: string[]
        connected_account_ids: string[]
        created_at: string
      }
      ok: boolean
    }
  }
  "/connect_webviews/create": {
    route: "/connect_webviews/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      accepted_providers?:
        | (
            | "akuvox"
            | "august"
            | "avigilon_alta"
            | "brivo"
            | "butterflymx"
            | "schlage"
            | "smartthings"
            | "yale"
            | "genie"
            | "doorking"
            | "salto"
            | "lockly"
            | "ttlock"
            | "linear"
            | "noiseaware"
            | "nuki"
            | "seam_relay_admin"
            | "igloo"
            | "kwikset"
            | "minut"
            | "my_2n"
            | "controlbyweb"
            | "nest"
            | "igloohome"
            | "ecobee"
            | "hubitat"
            | "four_suites"
            | "dormakaba_oracode"
            | "pti"
            | "wyze"
          )[]
        | undefined
      custom_redirect_url?: string | undefined
      device_selection_mode?: ("none" | "single" | "multiple") | undefined
      custom_redirect_failure_url?: string | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      connect_webview: {
        connect_webview_id: string
        url: string
        workspace_id: string
        status: "pending" | "authorized" | "failed"
        accepted_providers?:
          | (
              | "akuvox"
              | "august"
              | "avigilon_alta"
              | "brivo"
              | "butterflymx"
              | "schlage"
              | "smartthings"
              | "yale"
              | "genie"
              | "doorking"
              | "salto"
              | "lockly"
              | "ttlock"
              | "linear"
              | "noiseaware"
              | "nuki"
              | "seam_relay_admin"
              | "igloo"
              | "kwikset"
              | "minut"
              | "my_2n"
              | "controlbyweb"
              | "nest"
              | "igloohome"
              | "ecobee"
              | "hubitat"
              | "four_suites"
              | "dormakaba_oracode"
              | "pti"
              | "wyze"
            )[]
          | undefined
        connected_account_id: string | null
        created_at: string
        custom_redirect_url: string | null
        custom_redirect_failure_url: string | null
        device_selection_mode: "none" | "single" | "multiple"
        accepted_devices: string[]
        any_provider_allowed: boolean
        any_device_allowed: boolean | null
        login_successful: boolean
      }
      ok: boolean
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
        url: string
        workspace_id: string
        status: "pending" | "authorized" | "failed"
        accepted_providers?:
          | (
              | "akuvox"
              | "august"
              | "avigilon_alta"
              | "brivo"
              | "butterflymx"
              | "schlage"
              | "smartthings"
              | "yale"
              | "genie"
              | "doorking"
              | "salto"
              | "lockly"
              | "ttlock"
              | "linear"
              | "noiseaware"
              | "nuki"
              | "seam_relay_admin"
              | "igloo"
              | "kwikset"
              | "minut"
              | "my_2n"
              | "controlbyweb"
              | "nest"
              | "igloohome"
              | "ecobee"
              | "hubitat"
              | "four_suites"
              | "dormakaba_oracode"
              | "pti"
              | "wyze"
            )[]
          | undefined
        connected_account_id: string | null
        created_at: string
        custom_redirect_url: string | null
        custom_redirect_failure_url: string | null
        device_selection_mode: "none" | "single" | "multiple"
        accepted_devices: string[]
        any_provider_allowed: boolean
        any_device_allowed: boolean | null
        login_successful: boolean
      }
      ok: boolean
    }
  }
  "/connect_webviews/list": {
    route: "/connect_webviews/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      connect_webviews: {
        connect_webview_id: string
        url: string
        workspace_id: string
        status: "pending" | "authorized" | "failed"
        accepted_providers?:
          | (
              | "akuvox"
              | "august"
              | "avigilon_alta"
              | "brivo"
              | "butterflymx"
              | "schlage"
              | "smartthings"
              | "yale"
              | "genie"
              | "doorking"
              | "salto"
              | "lockly"
              | "ttlock"
              | "linear"
              | "noiseaware"
              | "nuki"
              | "seam_relay_admin"
              | "igloo"
              | "kwikset"
              | "minut"
              | "my_2n"
              | "controlbyweb"
              | "nest"
              | "igloohome"
              | "ecobee"
              | "hubitat"
              | "four_suites"
              | "dormakaba_oracode"
              | "pti"
              | "wyze"
            )[]
          | undefined
        connected_account_id: string | null
        created_at: string
        custom_redirect_url: string | null
        custom_redirect_failure_url: string | null
        device_selection_mode: "none" | "single" | "multiple"
        accepted_devices: string[]
        any_provider_allowed: boolean
        any_device_allowed: boolean | null
        login_successful: boolean
      }[]
      ok: boolean
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
  "/connected_accounts/delete": {
    route: "/connected_accounts/delete"
    method: "DELETE" | "POST"
    queryParams: {}
    jsonBody: {
      connected_account_id: string
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
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
        user_identifier: {
          email?: string | undefined
        }
        provider: string
        created_at: string
      }
      ok: boolean
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
        user_identifier: {
          email?: string | undefined
        }
        provider: string
        created_at: string
      }[]
      ok: boolean
    }
  }
  "/devices/delete": {
    route: "/devices/delete"
    method: "DELETE" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
    }
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/devices/get": {
    route: "/devices/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id?: string | undefined
      name?: string | undefined
    }
    formData: {}
    jsonResponse: {
      device: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              locked: boolean
              door_open?: boolean | undefined
              battery_level?: number | undefined
              has_direct_power?: boolean | undefined
              supported_code_lengths?: number[] | undefined
              max_active_codes_supported?: number | undefined
              serial_number?: string | undefined
              schlage_metadata?:
                | {
                    device_id: string
                    device_name: string
                    access_code_length: number
                    model?: string | undefined
                    location_id?: string | undefined
                  }
                | undefined
              august_metadata?:
                | {
                    lock_id: string
                    lock_name: string
                    house_name: string
                    has_keypad?: boolean | undefined
                    model?: string | undefined
                    keypad_battery_level?: string | undefined
                  }
                | undefined
              nuki_metadata?:
                | {
                    keypad_battery_critical?: boolean | undefined
                  }
                | undefined
              smartthings_metadata?: any | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              temperature_fahrenheit: number
              temperature_celsius: number
              relative_humidity: number
              can_enable_automatic_heating: boolean
              can_enable_automatic_cooling: boolean
              available_hvac_mode_settings:
                | "heat"
                | "cool"
                | "heat_cool"
                | "off"
              is_heating: boolean
              is_cooling: boolean
              is_fan_running: boolean
              is_temporary_manual_override_active: boolean
              current_climate_setting: {
                automatic_heating_enabled: boolean
                automatic_cooling_enabled: boolean
                hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                cooling_set_point_celsius?: number | undefined
                heating_set_point_celsius?: number | undefined
                cooling_set_point_fahrenheit?: number | undefined
                heating_set_point_fahrenheit?: number | undefined
                manual_override_allowed: boolean
              }
              default_climate_setting?:
                | {
                    automatic_heating_enabled: boolean
                    automatic_cooling_enabled: boolean
                    hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                    cooling_set_point_celsius?: number | undefined
                    heating_set_point_celsius?: number | undefined
                    cooling_set_point_fahrenheit?: number | undefined
                    heating_set_point_fahrenheit?: number | undefined
                    manual_override_allowed: boolean
                  }
                | undefined
              is_climate_setting_schedule_active: boolean
              active_climate_setting_schedule?:
                | {
                    climate_setting_schedule_id: string
                    schedule_type: "time_bound"
                    device_id: string
                    name?: string | undefined
                    schedule_starts_at: string
                    schedule_ends_at: string
                    created_at: string
                    automatic_heating_enabled?: boolean | undefined
                    automatic_cooling_enabled?: boolean | undefined
                    hvac_mode_setting?:
                      | ("off" | "heat" | "cool" | "heat_cool")
                      | undefined
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    heating_set_point_celsius?: (number | undefined) | undefined
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              is_cooling_available: boolean
              min_cooling_set_point_celsius: number
              min_cooling_set_point_fahrenheit: number
              max_cooling_set_point_celsius: number
              max_cooling_set_point_fahrenheit: number
              is_heating_available: boolean
              min_heating_set_point_celsius: number
              min_heating_set_point_fahrenheit: number
              max_heating_set_point_celsius: number
              max_heating_set_point_fahrenheit: number
              min_heating_cooling_delta_celsius: number
              min_heating_cooling_delta_fahrenheit: number
            }
        location?: any
        connected_account_id: string
        is_managed: boolean
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
      ok: boolean
    }
  }
  "/devices/list": {
    route: "/devices/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_ids?: string[] | undefined
      connected_account_id?: string | undefined
      connected_account_ids?: string[] | undefined
      device_type?:
        | (
            | (
                | "august_lock"
                | "schlage_lock"
                | "yale_lock"
                | "smartthings_lock"
              )
            | ("nest_thermostat" | "ecobee_thermostat")
            | ("minut_sensor" | "noiseaware_activity_zone")
          )
        | undefined
      device_types?:
        | (
            | (
                | "august_lock"
                | "schlage_lock"
                | "yale_lock"
                | "smartthings_lock"
              )
            | ("nest_thermostat" | "ecobee_thermostat")
            | ("minut_sensor" | "noiseaware_activity_zone")
          )[]
        | undefined
      manufacturer?: string | undefined
    }
    formData: {}
    jsonResponse: {
      devices: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              locked: boolean
              door_open?: boolean | undefined
              battery_level?: number | undefined
              has_direct_power?: boolean | undefined
              supported_code_lengths?: number[] | undefined
              max_active_codes_supported?: number | undefined
              serial_number?: string | undefined
              schlage_metadata?:
                | {
                    device_id: string
                    device_name: string
                    access_code_length: number
                    model?: string | undefined
                    location_id?: string | undefined
                  }
                | undefined
              august_metadata?:
                | {
                    lock_id: string
                    lock_name: string
                    house_name: string
                    has_keypad?: boolean | undefined
                    model?: string | undefined
                    keypad_battery_level?: string | undefined
                  }
                | undefined
              nuki_metadata?:
                | {
                    keypad_battery_critical?: boolean | undefined
                  }
                | undefined
              smartthings_metadata?: any | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              temperature_fahrenheit: number
              temperature_celsius: number
              relative_humidity: number
              can_enable_automatic_heating: boolean
              can_enable_automatic_cooling: boolean
              available_hvac_mode_settings:
                | "heat"
                | "cool"
                | "heat_cool"
                | "off"
              is_heating: boolean
              is_cooling: boolean
              is_fan_running: boolean
              is_temporary_manual_override_active: boolean
              current_climate_setting: {
                automatic_heating_enabled: boolean
                automatic_cooling_enabled: boolean
                hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                cooling_set_point_celsius?: number | undefined
                heating_set_point_celsius?: number | undefined
                cooling_set_point_fahrenheit?: number | undefined
                heating_set_point_fahrenheit?: number | undefined
                manual_override_allowed: boolean
              }
              default_climate_setting?:
                | {
                    automatic_heating_enabled: boolean
                    automatic_cooling_enabled: boolean
                    hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                    cooling_set_point_celsius?: number | undefined
                    heating_set_point_celsius?: number | undefined
                    cooling_set_point_fahrenheit?: number | undefined
                    heating_set_point_fahrenheit?: number | undefined
                    manual_override_allowed: boolean
                  }
                | undefined
              is_climate_setting_schedule_active: boolean
              active_climate_setting_schedule?:
                | {
                    climate_setting_schedule_id: string
                    schedule_type: "time_bound"
                    device_id: string
                    name?: string | undefined
                    schedule_starts_at: string
                    schedule_ends_at: string
                    created_at: string
                    automatic_heating_enabled?: boolean | undefined
                    automatic_cooling_enabled?: boolean | undefined
                    hvac_mode_setting?:
                      | ("off" | "heat" | "cool" | "heat_cool")
                      | undefined
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    heating_set_point_celsius?: (number | undefined) | undefined
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              is_cooling_available: boolean
              min_cooling_set_point_celsius: number
              min_cooling_set_point_fahrenheit: number
              max_cooling_set_point_celsius: number
              max_cooling_set_point_fahrenheit: number
              is_heating_available: boolean
              min_heating_set_point_celsius: number
              min_heating_set_point_fahrenheit: number
              max_heating_set_point_celsius: number
              max_heating_set_point_fahrenheit: number
              min_heating_cooling_delta_celsius: number
              min_heating_cooling_delta_fahrenheit: number
            }
        location?: any
        connected_account_id: string
        is_managed: boolean
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
      ok: boolean
    }
  }
  "/devices/list_device_providers": {
    route: "/devices/list_device_providers"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      provider_category?: ("stable" | "consumer_smartlocks") | undefined
    }
    formData: {}
    jsonResponse: {
      device_providers: {
        device_provider_name: string
        display_name: string
        image_url: string
        provider_categories: ("stable" | "consumer_smartlocks")[]
      }[]
      ok: boolean
    }
  }
  "/devices/unmanaged/get": {
    route: "/devices/unmanaged/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id?: string | undefined
      name?: string | undefined
    }
    formData: {}
    jsonResponse: {
      device: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
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
        properties: {
          name?: string | undefined
          manufacturer?: string | undefined
          image_url?: string | undefined
          image_alt_text?: string | undefined
          model: {
            display_name: string
          }
        }
      }
      ok: boolean
    }
  }
  "/devices/unmanaged/list": {
    route: "/devices/unmanaged/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_ids?: string[] | undefined
      connected_account_id?: string | undefined
      connected_account_ids?: string[] | undefined
      device_type?:
        | (
            | (
                | "august_lock"
                | "schlage_lock"
                | "yale_lock"
                | "smartthings_lock"
              )
            | ("nest_thermostat" | "ecobee_thermostat")
            | ("minut_sensor" | "noiseaware_activity_zone")
          )
        | undefined
      device_types?:
        | (
            | (
                | "august_lock"
                | "schlage_lock"
                | "yale_lock"
                | "smartthings_lock"
              )
            | ("nest_thermostat" | "ecobee_thermostat")
            | ("minut_sensor" | "noiseaware_activity_zone")
          )[]
        | undefined
      manufacturer?: string | undefined
    }
    formData: {}
    jsonResponse: {
      devices: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
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
        properties: {
          name?: string | undefined
          manufacturer?: string | undefined
          image_url?: string | undefined
          image_alt_text?: string | undefined
          model: {
            display_name: string
          }
        }
      }[]
      ok: boolean
    }
  }
  "/devices/unmanaged/update": {
    route: "/devices/unmanaged/update"
    method: "POST" | "PATCH"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
      is_managed: true
    }
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/devices/update": {
    route: "/devices/update"
    method: "POST" | "PATCH"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
      name?: (string | null) | undefined
      is_managed?: boolean
    }
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/events/get": {
    route: "/events/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      event_id?: string | undefined
      event_type?: string | undefined
      device_id?: string | undefined
    }
    formData: {}
    jsonResponse: {
      event: {
        event_id: string
        device_id?: string | undefined
        access_code_id?: string | undefined
        connected_account_id?: string | undefined
        event_type: string
        workspace_id: string
        created_at: string
        occurred_at: string
      }
      ok: boolean
    }
  }
  "/events/list": {
    route: "/events/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      since?: (string | Date) | undefined
      between?: (string | Date)[] | undefined
      device_id?: string | undefined
      device_ids?: string[] | undefined
      access_code_id?: string | undefined
      access_code_ids?: string[] | undefined
      event_type?: string | undefined
      event_types?: string[] | undefined
      connected_account_id?: string | undefined
    }
    formData: {}
    jsonResponse: {
      events: {
        event_id: string
        device_id?: string | undefined
        access_code_id?: string | undefined
        connected_account_id?: string | undefined
        event_type: string
        workspace_id: string
        created_at: string
        occurred_at: string
      }[]
      ok: boolean
    }
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
  "/internal/device_models/list": {
    route: "/internal/device_models/list"
    method: "GET"
    queryParams: {
      main_category?: string | undefined
      support_level?: string | undefined
      brand?: string | undefined
      text_search?: string | undefined
    }
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      device_models: {
        main_category: string
        model_name: string
        manufacturer_model_id: string
        connection_type: "wifi" | "zwave" | "zigbee" | "unknown"
        support_level: "live" | "beta" | "unsupported"
        brand: string
        icon_url: string
        seam_device_model_page_url: string
      }[]
      ok: boolean
    }
  }
  "/internal/devicedb_image_proxy": {
    route: "/internal/devicedb_image_proxy"
    method: "GET"
    queryParams: {
      image_id: string
    }
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {}
  }
  "/internal/devicedb/[...path]": {
    route: "/internal/devicedb/[...path]"
    method: "GET" | "OPTIONS"
    queryParams: {
      path: string[]
    }
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: any
  }
  "/internal/tlmtry": {
    route: "/internal/tlmtry"
    method: "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {}
  }
  "/locks/get": {
    route: "/locks/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id?: string | undefined
      name?: string | undefined
    }
    formData: {}
    jsonResponse: {
      lock: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              locked: boolean
              door_open?: boolean | undefined
              battery_level?: number | undefined
              has_direct_power?: boolean | undefined
              supported_code_lengths?: number[] | undefined
              max_active_codes_supported?: number | undefined
              serial_number?: string | undefined
              schlage_metadata?:
                | {
                    device_id: string
                    device_name: string
                    access_code_length: number
                    model?: string | undefined
                    location_id?: string | undefined
                  }
                | undefined
              august_metadata?:
                | {
                    lock_id: string
                    lock_name: string
                    house_name: string
                    has_keypad?: boolean | undefined
                    model?: string | undefined
                    keypad_battery_level?: string | undefined
                  }
                | undefined
              nuki_metadata?:
                | {
                    keypad_battery_critical?: boolean | undefined
                  }
                | undefined
              smartthings_metadata?: any | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              temperature_fahrenheit: number
              temperature_celsius: number
              relative_humidity: number
              can_enable_automatic_heating: boolean
              can_enable_automatic_cooling: boolean
              available_hvac_mode_settings:
                | "heat"
                | "cool"
                | "heat_cool"
                | "off"
              is_heating: boolean
              is_cooling: boolean
              is_fan_running: boolean
              is_temporary_manual_override_active: boolean
              current_climate_setting: {
                automatic_heating_enabled: boolean
                automatic_cooling_enabled: boolean
                hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                cooling_set_point_celsius?: number | undefined
                heating_set_point_celsius?: number | undefined
                cooling_set_point_fahrenheit?: number | undefined
                heating_set_point_fahrenheit?: number | undefined
                manual_override_allowed: boolean
              }
              default_climate_setting?:
                | {
                    automatic_heating_enabled: boolean
                    automatic_cooling_enabled: boolean
                    hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                    cooling_set_point_celsius?: number | undefined
                    heating_set_point_celsius?: number | undefined
                    cooling_set_point_fahrenheit?: number | undefined
                    heating_set_point_fahrenheit?: number | undefined
                    manual_override_allowed: boolean
                  }
                | undefined
              is_climate_setting_schedule_active: boolean
              active_climate_setting_schedule?:
                | {
                    climate_setting_schedule_id: string
                    schedule_type: "time_bound"
                    device_id: string
                    name?: string | undefined
                    schedule_starts_at: string
                    schedule_ends_at: string
                    created_at: string
                    automatic_heating_enabled?: boolean | undefined
                    automatic_cooling_enabled?: boolean | undefined
                    hvac_mode_setting?:
                      | ("off" | "heat" | "cool" | "heat_cool")
                      | undefined
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    heating_set_point_celsius?: (number | undefined) | undefined
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              is_cooling_available: boolean
              min_cooling_set_point_celsius: number
              min_cooling_set_point_fahrenheit: number
              max_cooling_set_point_celsius: number
              max_cooling_set_point_fahrenheit: number
              is_heating_available: boolean
              min_heating_set_point_celsius: number
              min_heating_set_point_fahrenheit: number
              max_heating_set_point_celsius: number
              max_heating_set_point_fahrenheit: number
              min_heating_cooling_delta_celsius: number
              min_heating_cooling_delta_fahrenheit: number
            }
        location?: any
        connected_account_id: string
        is_managed: boolean
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
      device: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              locked: boolean
              door_open?: boolean | undefined
              battery_level?: number | undefined
              has_direct_power?: boolean | undefined
              supported_code_lengths?: number[] | undefined
              max_active_codes_supported?: number | undefined
              serial_number?: string | undefined
              schlage_metadata?:
                | {
                    device_id: string
                    device_name: string
                    access_code_length: number
                    model?: string | undefined
                    location_id?: string | undefined
                  }
                | undefined
              august_metadata?:
                | {
                    lock_id: string
                    lock_name: string
                    house_name: string
                    has_keypad?: boolean | undefined
                    model?: string | undefined
                    keypad_battery_level?: string | undefined
                  }
                | undefined
              nuki_metadata?:
                | {
                    keypad_battery_critical?: boolean | undefined
                  }
                | undefined
              smartthings_metadata?: any | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              temperature_fahrenheit: number
              temperature_celsius: number
              relative_humidity: number
              can_enable_automatic_heating: boolean
              can_enable_automatic_cooling: boolean
              available_hvac_mode_settings:
                | "heat"
                | "cool"
                | "heat_cool"
                | "off"
              is_heating: boolean
              is_cooling: boolean
              is_fan_running: boolean
              is_temporary_manual_override_active: boolean
              current_climate_setting: {
                automatic_heating_enabled: boolean
                automatic_cooling_enabled: boolean
                hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                cooling_set_point_celsius?: number | undefined
                heating_set_point_celsius?: number | undefined
                cooling_set_point_fahrenheit?: number | undefined
                heating_set_point_fahrenheit?: number | undefined
                manual_override_allowed: boolean
              }
              default_climate_setting?:
                | {
                    automatic_heating_enabled: boolean
                    automatic_cooling_enabled: boolean
                    hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                    cooling_set_point_celsius?: number | undefined
                    heating_set_point_celsius?: number | undefined
                    cooling_set_point_fahrenheit?: number | undefined
                    heating_set_point_fahrenheit?: number | undefined
                    manual_override_allowed: boolean
                  }
                | undefined
              is_climate_setting_schedule_active: boolean
              active_climate_setting_schedule?:
                | {
                    climate_setting_schedule_id: string
                    schedule_type: "time_bound"
                    device_id: string
                    name?: string | undefined
                    schedule_starts_at: string
                    schedule_ends_at: string
                    created_at: string
                    automatic_heating_enabled?: boolean | undefined
                    automatic_cooling_enabled?: boolean | undefined
                    hvac_mode_setting?:
                      | ("off" | "heat" | "cool" | "heat_cool")
                      | undefined
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    heating_set_point_celsius?: (number | undefined) | undefined
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              is_cooling_available: boolean
              min_cooling_set_point_celsius: number
              min_cooling_set_point_fahrenheit: number
              max_cooling_set_point_celsius: number
              max_cooling_set_point_fahrenheit: number
              is_heating_available: boolean
              min_heating_set_point_celsius: number
              min_heating_set_point_fahrenheit: number
              max_heating_set_point_celsius: number
              max_heating_set_point_fahrenheit: number
              min_heating_cooling_delta_celsius: number
              min_heating_cooling_delta_fahrenheit: number
            }
        location?: any
        connected_account_id: string
        is_managed: boolean
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
      ok: boolean
    }
  }
  "/locks/list": {
    route: "/locks/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_ids?: string[] | undefined
      connected_account_id?: string | undefined
      connected_account_ids?: string[] | undefined
      device_type?:
        | (
            | (
                | "august_lock"
                | "schlage_lock"
                | "yale_lock"
                | "smartthings_lock"
              )
            | ("nest_thermostat" | "ecobee_thermostat")
            | ("minut_sensor" | "noiseaware_activity_zone")
          )
        | undefined
      device_types?:
        | (
            | (
                | "august_lock"
                | "schlage_lock"
                | "yale_lock"
                | "smartthings_lock"
              )
            | ("nest_thermostat" | "ecobee_thermostat")
            | ("minut_sensor" | "noiseaware_activity_zone")
          )[]
        | undefined
      manufacturer?: string | undefined
    }
    formData: {}
    jsonResponse: {
      locks: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              locked: boolean
              door_open?: boolean | undefined
              battery_level?: number | undefined
              has_direct_power?: boolean | undefined
              supported_code_lengths?: number[] | undefined
              max_active_codes_supported?: number | undefined
              serial_number?: string | undefined
              schlage_metadata?:
                | {
                    device_id: string
                    device_name: string
                    access_code_length: number
                    model?: string | undefined
                    location_id?: string | undefined
                  }
                | undefined
              august_metadata?:
                | {
                    lock_id: string
                    lock_name: string
                    house_name: string
                    has_keypad?: boolean | undefined
                    model?: string | undefined
                    keypad_battery_level?: string | undefined
                  }
                | undefined
              nuki_metadata?:
                | {
                    keypad_battery_critical?: boolean | undefined
                  }
                | undefined
              smartthings_metadata?: any | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              temperature_fahrenheit: number
              temperature_celsius: number
              relative_humidity: number
              can_enable_automatic_heating: boolean
              can_enable_automatic_cooling: boolean
              available_hvac_mode_settings:
                | "heat"
                | "cool"
                | "heat_cool"
                | "off"
              is_heating: boolean
              is_cooling: boolean
              is_fan_running: boolean
              is_temporary_manual_override_active: boolean
              current_climate_setting: {
                automatic_heating_enabled: boolean
                automatic_cooling_enabled: boolean
                hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                cooling_set_point_celsius?: number | undefined
                heating_set_point_celsius?: number | undefined
                cooling_set_point_fahrenheit?: number | undefined
                heating_set_point_fahrenheit?: number | undefined
                manual_override_allowed: boolean
              }
              default_climate_setting?:
                | {
                    automatic_heating_enabled: boolean
                    automatic_cooling_enabled: boolean
                    hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                    cooling_set_point_celsius?: number | undefined
                    heating_set_point_celsius?: number | undefined
                    cooling_set_point_fahrenheit?: number | undefined
                    heating_set_point_fahrenheit?: number | undefined
                    manual_override_allowed: boolean
                  }
                | undefined
              is_climate_setting_schedule_active: boolean
              active_climate_setting_schedule?:
                | {
                    climate_setting_schedule_id: string
                    schedule_type: "time_bound"
                    device_id: string
                    name?: string | undefined
                    schedule_starts_at: string
                    schedule_ends_at: string
                    created_at: string
                    automatic_heating_enabled?: boolean | undefined
                    automatic_cooling_enabled?: boolean | undefined
                    hvac_mode_setting?:
                      | ("off" | "heat" | "cool" | "heat_cool")
                      | undefined
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    heating_set_point_celsius?: (number | undefined) | undefined
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              is_cooling_available: boolean
              min_cooling_set_point_celsius: number
              min_cooling_set_point_fahrenheit: number
              max_cooling_set_point_celsius: number
              max_cooling_set_point_fahrenheit: number
              is_heating_available: boolean
              min_heating_set_point_celsius: number
              min_heating_set_point_fahrenheit: number
              max_heating_set_point_celsius: number
              max_heating_set_point_fahrenheit: number
              min_heating_cooling_delta_celsius: number
              min_heating_cooling_delta_fahrenheit: number
            }
        location?: any
        connected_account_id: string
        is_managed: boolean
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
      devices: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              locked: boolean
              door_open?: boolean | undefined
              battery_level?: number | undefined
              has_direct_power?: boolean | undefined
              supported_code_lengths?: number[] | undefined
              max_active_codes_supported?: number | undefined
              serial_number?: string | undefined
              schlage_metadata?:
                | {
                    device_id: string
                    device_name: string
                    access_code_length: number
                    model?: string | undefined
                    location_id?: string | undefined
                  }
                | undefined
              august_metadata?:
                | {
                    lock_id: string
                    lock_name: string
                    house_name: string
                    has_keypad?: boolean | undefined
                    model?: string | undefined
                    keypad_battery_level?: string | undefined
                  }
                | undefined
              nuki_metadata?:
                | {
                    keypad_battery_critical?: boolean | undefined
                  }
                | undefined
              smartthings_metadata?: any | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              temperature_fahrenheit: number
              temperature_celsius: number
              relative_humidity: number
              can_enable_automatic_heating: boolean
              can_enable_automatic_cooling: boolean
              available_hvac_mode_settings:
                | "heat"
                | "cool"
                | "heat_cool"
                | "off"
              is_heating: boolean
              is_cooling: boolean
              is_fan_running: boolean
              is_temporary_manual_override_active: boolean
              current_climate_setting: {
                automatic_heating_enabled: boolean
                automatic_cooling_enabled: boolean
                hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                cooling_set_point_celsius?: number | undefined
                heating_set_point_celsius?: number | undefined
                cooling_set_point_fahrenheit?: number | undefined
                heating_set_point_fahrenheit?: number | undefined
                manual_override_allowed: boolean
              }
              default_climate_setting?:
                | {
                    automatic_heating_enabled: boolean
                    automatic_cooling_enabled: boolean
                    hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                    cooling_set_point_celsius?: number | undefined
                    heating_set_point_celsius?: number | undefined
                    cooling_set_point_fahrenheit?: number | undefined
                    heating_set_point_fahrenheit?: number | undefined
                    manual_override_allowed: boolean
                  }
                | undefined
              is_climate_setting_schedule_active: boolean
              active_climate_setting_schedule?:
                | {
                    climate_setting_schedule_id: string
                    schedule_type: "time_bound"
                    device_id: string
                    name?: string | undefined
                    schedule_starts_at: string
                    schedule_ends_at: string
                    created_at: string
                    automatic_heating_enabled?: boolean | undefined
                    automatic_cooling_enabled?: boolean | undefined
                    hvac_mode_setting?:
                      | ("off" | "heat" | "cool" | "heat_cool")
                      | undefined
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    heating_set_point_celsius?: (number | undefined) | undefined
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              is_cooling_available: boolean
              min_cooling_set_point_celsius: number
              min_cooling_set_point_fahrenheit: number
              max_cooling_set_point_celsius: number
              max_cooling_set_point_fahrenheit: number
              is_heating_available: boolean
              min_heating_set_point_celsius: number
              min_heating_set_point_fahrenheit: number
              max_heating_set_point_celsius: number
              max_heating_set_point_fahrenheit: number
              min_heating_cooling_delta_celsius: number
              min_heating_cooling_delta_fahrenheit: number
            }
        location?: any
        connected_account_id: string
        is_managed: boolean
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
      ok: boolean
    }
  }
  "/locks/lock_door": {
    route: "/locks/lock_door"
    method: "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/locks/unlock_door": {
    route: "/locks/unlock_door"
    method: "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/noise_sensors/noise_thresholds/create": {
    route: "/noise_sensors/noise_thresholds/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      sync?: boolean
      name?: string | undefined
      starts_daily_at: string
      ends_daily_at: string
      noise_threshold_decibels?: number | undefined
      noise_threshold_nrs?: number | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/noise_sensors/noise_thresholds/delete": {
    route: "/noise_sensors/noise_thresholds/delete"
    method: "DELETE" | "POST"
    queryParams: {}
    jsonBody: {
      noise_threshold_id: string
      device_id: string
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/noise_sensors/noise_thresholds/get": {
    route: "/noise_sensors/noise_thresholds/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      noise_threshold_id: string
    }
    formData: {}
    jsonResponse: {
      noise_threshold: {
        noise_threshold_id: string
        device_id: string
        name: string
        noise_threshold_nrs?: number | undefined
        starts_daily_at: string
        ends_daily_at: string
        noise_threshold_decibels: number
      }
      ok: boolean
    }
  }
  "/noise_sensors/noise_thresholds/list": {
    route: "/noise_sensors/noise_thresholds/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
    }
    formData: {}
    jsonResponse: {
      noise_thresholds: {
        noise_threshold_id: string
        device_id: string
        name: string
        noise_threshold_nrs?: number | undefined
        starts_daily_at: string
        ends_daily_at: string
        noise_threshold_decibels: number
      }[]
      ok: boolean
    }
  }
  "/noise_sensors/noise_thresholds/update": {
    route: "/noise_sensors/noise_thresholds/update"
    method: "PATCH" | "POST"
    queryParams: {}
    jsonBody: {
      noise_threshold_id: string
      device_id: string
      sync?: boolean
      name?: string | undefined
      starts_daily_at?: string | undefined
      ends_daily_at?: string | undefined
      noise_threshold_decibels?: number | undefined
      noise_threshold_nrs?: number | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/thermostats/climate_setting_schedules/create": {
    route: "/thermostats/climate_setting_schedules/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      schedule_type?: "time_bound"
      device_id: string
      name?: string | undefined
      schedule_starts_at: string | Date
      schedule_ends_at: string | Date
      automatic_heating_enabled?: boolean | undefined
      automatic_cooling_enabled?: boolean | undefined
      hvac_mode_setting?: ("off" | "heat" | "cool" | "heat_cool") | undefined
      cooling_set_point_celsius?: (number | undefined) | undefined
      heating_set_point_celsius?: (number | undefined) | undefined
      cooling_set_point_fahrenheit?: (number | undefined) | undefined
      heating_set_point_fahrenheit?: (number | undefined) | undefined
      manual_override_allowed?: boolean | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      climate_setting_schedule: {
        climate_setting_schedule_id: string
        schedule_type: "time_bound"
        device_id: string
        name?: string | undefined
        schedule_starts_at: string
        schedule_ends_at: string
        created_at: string
        automatic_heating_enabled?: boolean | undefined
        automatic_cooling_enabled?: boolean | undefined
        hvac_mode_setting?: ("off" | "heat" | "cool" | "heat_cool") | undefined
        cooling_set_point_celsius?: (number | undefined) | undefined
        heating_set_point_celsius?: (number | undefined) | undefined
        cooling_set_point_fahrenheit?: (number | undefined) | undefined
        heating_set_point_fahrenheit?: (number | undefined) | undefined
        manual_override_allowed?: boolean | undefined
      }
      ok: boolean
    }
  }
  "/thermostats/climate_setting_schedules/delete": {
    route: "/thermostats/climate_setting_schedules/delete"
    method: "POST" | "DELETE"
    queryParams: {}
    jsonBody: {
      climate_setting_schedule_id: string
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/thermostats/climate_setting_schedules/get": {
    route: "/thermostats/climate_setting_schedules/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      climate_setting_schedule_id: string
      device_id?: string | undefined
    }
    formData: {}
    jsonResponse: {
      climate_setting_schedule: {
        climate_setting_schedule_id: string
        schedule_type: "time_bound"
        device_id: string
        name?: string | undefined
        schedule_starts_at: string
        schedule_ends_at: string
        created_at: string
        automatic_heating_enabled?: boolean | undefined
        automatic_cooling_enabled?: boolean | undefined
        hvac_mode_setting?: ("off" | "heat" | "cool" | "heat_cool") | undefined
        cooling_set_point_celsius?: (number | undefined) | undefined
        heating_set_point_celsius?: (number | undefined) | undefined
        cooling_set_point_fahrenheit?: (number | undefined) | undefined
        heating_set_point_fahrenheit?: (number | undefined) | undefined
        manual_override_allowed?: boolean | undefined
      }
      ok: boolean
    }
  }
  "/thermostats/climate_setting_schedules/list": {
    route: "/thermostats/climate_setting_schedules/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
    }
    formData: {}
    jsonResponse: {
      climate_setting_schedules: {
        climate_setting_schedule_id: string
        schedule_type: "time_bound"
        device_id: string
        name?: string | undefined
        schedule_starts_at: string
        schedule_ends_at: string
        created_at: string
        automatic_heating_enabled?: boolean | undefined
        automatic_cooling_enabled?: boolean | undefined
        hvac_mode_setting?: ("off" | "heat" | "cool" | "heat_cool") | undefined
        cooling_set_point_celsius?: (number | undefined) | undefined
        heating_set_point_celsius?: (number | undefined) | undefined
        cooling_set_point_fahrenheit?: (number | undefined) | undefined
        heating_set_point_fahrenheit?: (number | undefined) | undefined
        manual_override_allowed?: boolean | undefined
      }[]
      ok: boolean
    }
  }
  "/thermostats/climate_setting_schedules/update": {
    route: "/thermostats/climate_setting_schedules/update"
    method: "POST"
    queryParams: {}
    jsonBody: {
      climate_setting_schedule_id: string
      schedule_type?: "time_bound"
      name?: string | undefined
      schedule_starts_at?: (string | Date) | undefined
      schedule_ends_at?: (string | Date) | undefined
      automatic_heating_enabled?: boolean | undefined
      automatic_cooling_enabled?: boolean | undefined
      hvac_mode_setting?: ("off" | "heat" | "cool" | "heat_cool") | undefined
      cooling_set_point_celsius?: (number | undefined) | undefined
      heating_set_point_celsius?: (number | undefined) | undefined
      cooling_set_point_fahrenheit?: (number | undefined) | undefined
      heating_set_point_fahrenheit?: (number | undefined) | undefined
      manual_override_allowed?: boolean | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      climate_setting_schedule: {
        climate_setting_schedule_id: string
        schedule_type: "time_bound"
        device_id: string
        name?: string | undefined
        schedule_starts_at: string
        schedule_ends_at: string
        created_at: string
        automatic_heating_enabled?: boolean | undefined
        automatic_cooling_enabled?: boolean | undefined
        hvac_mode_setting?: ("off" | "heat" | "cool" | "heat_cool") | undefined
        cooling_set_point_celsius?: (number | undefined) | undefined
        heating_set_point_celsius?: (number | undefined) | undefined
        cooling_set_point_fahrenheit?: (number | undefined) | undefined
        heating_set_point_fahrenheit?: (number | undefined) | undefined
        manual_override_allowed?: boolean | undefined
      }
      ok: boolean
    }
  }
  "/thermostats/cool": {
    route: "/thermostats/cool"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
      cooling_set_point_celsius?: number | undefined
      cooling_set_point_fahrenheit?: number | undefined
      sync?: boolean
    }
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/thermostats/get": {
    route: "/thermostats/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id?: string | undefined
      name?: string | undefined
    }
    formData: {}
    jsonResponse: {
      thermostat: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              locked: boolean
              door_open?: boolean | undefined
              battery_level?: number | undefined
              has_direct_power?: boolean | undefined
              supported_code_lengths?: number[] | undefined
              max_active_codes_supported?: number | undefined
              serial_number?: string | undefined
              schlage_metadata?:
                | {
                    device_id: string
                    device_name: string
                    access_code_length: number
                    model?: string | undefined
                    location_id?: string | undefined
                  }
                | undefined
              august_metadata?:
                | {
                    lock_id: string
                    lock_name: string
                    house_name: string
                    has_keypad?: boolean | undefined
                    model?: string | undefined
                    keypad_battery_level?: string | undefined
                  }
                | undefined
              nuki_metadata?:
                | {
                    keypad_battery_critical?: boolean | undefined
                  }
                | undefined
              smartthings_metadata?: any | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              temperature_fahrenheit: number
              temperature_celsius: number
              relative_humidity: number
              can_enable_automatic_heating: boolean
              can_enable_automatic_cooling: boolean
              available_hvac_mode_settings:
                | "heat"
                | "cool"
                | "heat_cool"
                | "off"
              is_heating: boolean
              is_cooling: boolean
              is_fan_running: boolean
              is_temporary_manual_override_active: boolean
              current_climate_setting: {
                automatic_heating_enabled: boolean
                automatic_cooling_enabled: boolean
                hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                cooling_set_point_celsius?: number | undefined
                heating_set_point_celsius?: number | undefined
                cooling_set_point_fahrenheit?: number | undefined
                heating_set_point_fahrenheit?: number | undefined
                manual_override_allowed: boolean
              }
              default_climate_setting?:
                | {
                    automatic_heating_enabled: boolean
                    automatic_cooling_enabled: boolean
                    hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                    cooling_set_point_celsius?: number | undefined
                    heating_set_point_celsius?: number | undefined
                    cooling_set_point_fahrenheit?: number | undefined
                    heating_set_point_fahrenheit?: number | undefined
                    manual_override_allowed: boolean
                  }
                | undefined
              is_climate_setting_schedule_active: boolean
              active_climate_setting_schedule?:
                | {
                    climate_setting_schedule_id: string
                    schedule_type: "time_bound"
                    device_id: string
                    name?: string | undefined
                    schedule_starts_at: string
                    schedule_ends_at: string
                    created_at: string
                    automatic_heating_enabled?: boolean | undefined
                    automatic_cooling_enabled?: boolean | undefined
                    hvac_mode_setting?:
                      | ("off" | "heat" | "cool" | "heat_cool")
                      | undefined
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    heating_set_point_celsius?: (number | undefined) | undefined
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              is_cooling_available: boolean
              min_cooling_set_point_celsius: number
              min_cooling_set_point_fahrenheit: number
              max_cooling_set_point_celsius: number
              max_cooling_set_point_fahrenheit: number
              is_heating_available: boolean
              min_heating_set_point_celsius: number
              min_heating_set_point_fahrenheit: number
              max_heating_set_point_celsius: number
              max_heating_set_point_fahrenheit: number
              min_heating_cooling_delta_celsius: number
              min_heating_cooling_delta_fahrenheit: number
            }
        location?: any
        connected_account_id: string
        is_managed: boolean
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
      ok: boolean
    }
  }
  "/thermostats/heat": {
    route: "/thermostats/heat"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
      heating_set_point_celsius?: number | undefined
      heating_set_point_fahrenheit?: number | undefined
      sync?: boolean
    }
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/thermostats/heat_cool": {
    route: "/thermostats/heat_cool"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      heating_set_point_celsius?: number | undefined
      heating_set_point_fahrenheit?: number | undefined
      cooling_set_point_celsius?: number | undefined
      cooling_set_point_fahrenheit?: number | undefined
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/thermostats/list": {
    route: "/thermostats/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      thermostats: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              locked: boolean
              door_open?: boolean | undefined
              battery_level?: number | undefined
              has_direct_power?: boolean | undefined
              supported_code_lengths?: number[] | undefined
              max_active_codes_supported?: number | undefined
              serial_number?: string | undefined
              schlage_metadata?:
                | {
                    device_id: string
                    device_name: string
                    access_code_length: number
                    model?: string | undefined
                    location_id?: string | undefined
                  }
                | undefined
              august_metadata?:
                | {
                    lock_id: string
                    lock_name: string
                    house_name: string
                    has_keypad?: boolean | undefined
                    model?: string | undefined
                    keypad_battery_level?: string | undefined
                  }
                | undefined
              nuki_metadata?:
                | {
                    keypad_battery_critical?: boolean | undefined
                  }
                | undefined
              smartthings_metadata?: any | undefined
            }
          | {
              online: boolean
              name: string
              model: {
                display_name: string
                manufacturer_display_name: string
              }
              manufacturer?: string | undefined
              battery?:
                | {
                    level: number
                    status: "critical" | "low" | "good" | "full"
                  }
                | undefined
              image_url?: string | undefined
              temperature_fahrenheit: number
              temperature_celsius: number
              relative_humidity: number
              can_enable_automatic_heating: boolean
              can_enable_automatic_cooling: boolean
              available_hvac_mode_settings:
                | "heat"
                | "cool"
                | "heat_cool"
                | "off"
              is_heating: boolean
              is_cooling: boolean
              is_fan_running: boolean
              is_temporary_manual_override_active: boolean
              current_climate_setting: {
                automatic_heating_enabled: boolean
                automatic_cooling_enabled: boolean
                hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                cooling_set_point_celsius?: number | undefined
                heating_set_point_celsius?: number | undefined
                cooling_set_point_fahrenheit?: number | undefined
                heating_set_point_fahrenheit?: number | undefined
                manual_override_allowed: boolean
              }
              default_climate_setting?:
                | {
                    automatic_heating_enabled: boolean
                    automatic_cooling_enabled: boolean
                    hvac_mode_setting: "off" | "heat" | "cool" | "heat_cool"
                    cooling_set_point_celsius?: number | undefined
                    heating_set_point_celsius?: number | undefined
                    cooling_set_point_fahrenheit?: number | undefined
                    heating_set_point_fahrenheit?: number | undefined
                    manual_override_allowed: boolean
                  }
                | undefined
              is_climate_setting_schedule_active: boolean
              active_climate_setting_schedule?:
                | {
                    climate_setting_schedule_id: string
                    schedule_type: "time_bound"
                    device_id: string
                    name?: string | undefined
                    schedule_starts_at: string
                    schedule_ends_at: string
                    created_at: string
                    automatic_heating_enabled?: boolean | undefined
                    automatic_cooling_enabled?: boolean | undefined
                    hvac_mode_setting?:
                      | ("off" | "heat" | "cool" | "heat_cool")
                      | undefined
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    heating_set_point_celsius?: (number | undefined) | undefined
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              is_cooling_available: boolean
              min_cooling_set_point_celsius: number
              min_cooling_set_point_fahrenheit: number
              max_cooling_set_point_celsius: number
              max_cooling_set_point_fahrenheit: number
              is_heating_available: boolean
              min_heating_set_point_celsius: number
              min_heating_set_point_fahrenheit: number
              max_heating_set_point_celsius: number
              max_heating_set_point_fahrenheit: number
              min_heating_cooling_delta_celsius: number
              min_heating_cooling_delta_fahrenheit: number
            }
        location?: any
        connected_account_id: string
        is_managed: boolean
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
      ok: boolean
    }
  }
  "/thermostats/off": {
    route: "/thermostats/off"
    method: "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/thermostats/set_fan_mode": {
    route: "/thermostats/set_fan_mode"
    method: "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      fan_mode_setting: "auto" | "on"
      sync?: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      action_attempt:
        | {
            status: "success"
            action_type: string
            action_attempt_id: string
            result?: any
            error: null
          }
        | {
            status: "pending"
            action_type: string
            action_attempt_id: string
            result: null
            error: null
          }
        | {
            status: "error"
            action_type: string
            action_attempt_id: string
            result: null
            error: {
              type: string
              message: string
            }
          }
      ok: boolean
    }
  }
  "/thermostats/update": {
    route: "/thermostats/update"
    method: "PATCH" | "POST"
    queryParams: {}
    jsonBody: {
      device_id: string
      default_climate_setting: {
        automatic_heating_enabled?: boolean | undefined
        automatic_cooling_enabled?: boolean | undefined
        hvac_mode_setting?: ("off" | "heat" | "cool" | "heat_cool") | undefined
        cooling_set_point_celsius?: (number | undefined) | undefined
        heating_set_point_celsius?: (number | undefined) | undefined
        cooling_set_point_fahrenheit?: (number | undefined) | undefined
        heating_set_point_fahrenheit?: (number | undefined) | undefined
        manual_override_allowed?: boolean | undefined
      }
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/workspaces/get": {
    route: "/workspaces/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      workspace: {
        workspace_id: string
        name: string
        publishable_key: string
        created_at: string
      }
      ok: boolean
    }
  }
  "/workspaces/list": {
    route: "/workspaces/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      workspaces: {
        workspace_id: string
        name: string
        publishable_key: string
        created_at: string
      }[]
      ok: boolean
    }
  }
}

export type RouteResponse<Path extends keyof Routes> =
  Routes[Path]["jsonResponse"]

export type RouteRequestBody<Path extends keyof Routes> =
  Routes[Path]["jsonBody"] & Routes[Path]["commonParams"]

export type RouteRequestParams<Path extends keyof Routes> =
  Routes[Path]["queryParams"] & Routes[Path]["commonParams"]
