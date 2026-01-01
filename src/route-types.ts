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
  "/_fake/default_seed": {
    route: "/_fake/default_seed"
    method: "GET"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      john_connected_account_id: "john_connected_account_id"
      jane_connected_account_id: "jane_connected_account_id"
      john_assa_cs_connected_account_id: "john_assa_cs_connected_account_id"
      seed_workspace_1: "seed_workspace_1"
      seed_workspace_2: "seed_workspace_2"
      john_user_workspace_1: "john_user_workspace_1"
      august_device_1: "august_device_1"
      august_device_2: "august_device_2"
      ecobee_device_1: "ecobee_device_1"
      minut_device_1: "minut_device_1"
      schlage_device_1: "schlage_device_id"
      seam_apikey1_token: "seam_apikey1_token"
      seam_apikey2_token: "seam_apikey2_token"
      seam_cst1_token: "seam_cst1_token"
      seam_pk1_token: "seam_pk1_token"
      seam_at1_token: "seam_at1_longtoken"
      john_user_identifier_key: "john_user_identifier_key"
      john_user_identity_id: "john_user_identity_id"
      john_user_id: "john_user_id"
      john_user_key: "john_user_key"
      visionline_acs_system_1: "visionline_acs_system_1"
      bridge_client_session_token: "bcs1_token"
      ok: boolean
    }
  }
  "/_fake/enter_bridge_pairing_code": {
    route: "/_fake/enter_bridge_pairing_code"
    method: "POST"
    queryParams: {}
    jsonBody: {
      pairing_code: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/_fake/simulate_enter_bridge_pairing_code": {
    route: "/_fake/simulate_enter_bridge_pairing_code"
    method: "POST"
    queryParams: {}
    jsonBody: {
      pairing_code: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/_fake/simulate_workspace_outage": {
    route: "/_fake/simulate_workspace_outage"
    method: "POST"
    queryParams: {}
    jsonBody: {
      workspace_id: string
      routes: string[]
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/_fake/update_action_attempt": {
    route: "/_fake/update_action_attempt"
    method: "PATCH" | "POST"
    queryParams: {}
    jsonBody:
      | {
          status: "success"
          action_attempt_id: string
          result?: any
        }
      | {
          status: "error"
          action_attempt_id: string
          error: {
            type: string
            message: string
          }
        }
      | {
          status: "pending"
          action_attempt_id: string
        }
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
      preferred_code_length?: number | undefined
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
    queryParams: {}
    jsonBody: {}
    commonParams: {
      device_id: string
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
            is_one_time_use: boolean
            is_offline_access_code: boolean
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
  "/acs/entrances/get": {
    route: "/acs/entrances/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      acs_entrance_id: string
    }
    formData: {}
    jsonResponse: {
      acs_entrance: {
        acs_entrance_id: string
        display_name: string
        acs_system_id: string
        workspace_id: string
        created_at: string
        properties: {
          [x: string]: any
        }
        visionline_metadata: {
          door_name: string
          door_category:
            | "entrance"
            | "guest"
            | "elevator reader"
            | "common"
            | "common (PMS)"
          profiles?:
            | {
                visionline_door_profile_id: string
                visionline_door_profile_type: "BLE" | "commonDoor" | "touch"
              }[]
            | undefined
        } | null
      }
      ok: boolean
    }
  }
  "/acs/entrances/grant_access": {
    route: "/acs/entrances/grant_access"
    method: "POST"
    queryParams: {}
    jsonBody: {
      acs_entrance_id: string
      acs_user_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/acs/entrances/list": {
    route: "/acs/entrances/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      acs_system_id?: string | undefined
      acs_credential_id?: string | undefined
    }
    formData: {}
    jsonResponse: {
      acs_entrances: {
        acs_entrance_id: string
        display_name: string
        acs_system_id: string
        workspace_id: string
        created_at: string
        properties: {
          [x: string]: any
        }
        visionline_metadata: {
          door_name: string
          door_category:
            | "entrance"
            | "guest"
            | "elevator reader"
            | "common"
            | "common (PMS)"
          profiles?:
            | {
                visionline_door_profile_id: string
                visionline_door_profile_type: "BLE" | "commonDoor" | "touch"
              }[]
            | undefined
        } | null
      }[]
      ok: boolean
    }
  }
  "/acs/systems/get": {
    route: "/acs/systems/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      acs_system_id: string
    }
    formData: {}
    jsonResponse: {
      acs_system: {
        acs_system_id: string
        external_type:
          | "pti_site"
          | "alta_org"
          | "salto_site"
          | "brivo_account"
          | "hid_credential_manager_organization"
          | "visionline_system"
          | "assa_abloy_credential_service"
        external_type_display_name: string
        /** deprecated: use external_type */
        system_type:
          | "pti_site"
          | "alta_org"
          | "salto_site"
          | "brivo_account"
          | "hid_credential_manager_organization"
          | "visionline_system"
          | "assa_abloy_credential_service"
        /** deprecated: use external_type_display_name */
        system_type_display_name: string
        name: string
        created_at: string
        workspace_id: string
        connected_account_id: string
      }
      ok: boolean
    }
  }
  "/acs/systems/list": {
    route: "/acs/systems/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      connected_account_id?: string | undefined
    }
    formData: {}
    jsonResponse: {
      acs_systems: {
        acs_system_id: string
        external_type:
          | "pti_site"
          | "alta_org"
          | "salto_site"
          | "brivo_account"
          | "hid_credential_manager_organization"
          | "visionline_system"
          | "assa_abloy_credential_service"
        external_type_display_name: string
        /** deprecated: use external_type */
        system_type:
          | "pti_site"
          | "alta_org"
          | "salto_site"
          | "brivo_account"
          | "hid_credential_manager_organization"
          | "visionline_system"
          | "assa_abloy_credential_service"
        /** deprecated: use external_type_display_name */
        system_type_display_name: string
        name: string
        created_at: string
        workspace_id: string
        connected_account_id: string
      }[]
      ok: boolean
    }
  }
  "/acs/users/add_to_access_group": {
    route: "/acs/users/add_to_access_group"
    method: "PUT" | "POST"
    queryParams: {}
    jsonBody: {
      acs_user_id: string
      acs_access_group_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/acs/users/create": {
    route: "/acs/users/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      acs_system_id: string
      acs_access_group_ids?: string[]
      user_identity_id?: string | undefined
      access_schedule?:
        | {
            starts_at: string
            ends_at: string
          }
        | undefined
      full_name?: string | undefined
      /** Deprecated: use email_address. */
      email?: string | undefined
      phone_number?: string | undefined
      email_address?: string | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      acs_user: {
        acs_user_id: string
        acs_system_id: string
        hid_acs_system_id?: string | undefined
        workspace_id: string
        created_at: string
        display_name: string
        external_type?:
          | (
              | "pti_user"
              | "brivo_user"
              | "hid_credential_manager_user"
              | "salto_site_user"
            )
          | undefined
        external_type_display_name?: string | undefined
        is_suspended: boolean
        access_schedule?:
          | {
              starts_at: string
              ends_at: string
            }
          | undefined
        user_identity_id?: string | undefined
        user_identity_email_address?: string | undefined
        user_identity_phone_number?: string | undefined
        full_name?: string | undefined
        /** Deprecated: use email_address. */
        email?: string | undefined
        email_address?: string | undefined
        phone_number?: string | undefined
      }
      ok: boolean
    }
  }
  "/acs/users/delete": {
    route: "/acs/users/delete"
    method: "DELETE" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      acs_user_id: string
    }
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/acs/users/get": {
    route: "/acs/users/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      acs_user_id: string
    }
    formData: {}
    jsonResponse: {
      acs_user: {
        acs_user_id: string
        acs_system_id: string
        hid_acs_system_id?: string | undefined
        workspace_id: string
        created_at: string
        display_name: string
        external_type?:
          | (
              | "pti_user"
              | "brivo_user"
              | "hid_credential_manager_user"
              | "salto_site_user"
            )
          | undefined
        external_type_display_name?: string | undefined
        is_suspended: boolean
        access_schedule?:
          | {
              starts_at: string
              ends_at: string
            }
          | undefined
        user_identity_id?: string | undefined
        user_identity_email_address?: string | undefined
        user_identity_phone_number?: string | undefined
        full_name?: string | undefined
        /** Deprecated: use email_address. */
        email?: string | undefined
        email_address?: string | undefined
        phone_number?: string | undefined
      }
      ok: boolean
    }
  }
  "/acs/users/list": {
    route: "/acs/users/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      user_identity_id?: string | undefined
      user_identity_phone_number?: string | undefined
      user_identity_email_address?: string | undefined
      acs_system_id?: string | undefined
    }
    formData: {}
    jsonResponse: {
      acs_users: {
        acs_user_id: string
        acs_system_id: string
        hid_acs_system_id?: string | undefined
        workspace_id: string
        created_at: string
        display_name: string
        external_type?:
          | (
              | "pti_user"
              | "brivo_user"
              | "hid_credential_manager_user"
              | "salto_site_user"
            )
          | undefined
        external_type_display_name?: string | undefined
        is_suspended: boolean
        access_schedule?:
          | {
              starts_at: string
              ends_at: string
            }
          | undefined
        user_identity_id?: string | undefined
        user_identity_email_address?: string | undefined
        user_identity_phone_number?: string | undefined
        full_name?: string | undefined
        /** Deprecated: use email_address. */
        email?: string | undefined
        email_address?: string | undefined
        phone_number?: string | undefined
      }[]
      ok: boolean
    }
  }
  "/acs/users/remove_from_access_group": {
    route: "/acs/users/remove_from_access_group"
    method: "DELETE" | "POST"
    queryParams: {}
    jsonBody: {
      acs_user_id: string
      acs_access_group_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/acs/users/suspend": {
    route: "/acs/users/suspend"
    method: "POST"
    queryParams: {}
    jsonBody: {
      acs_user_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/acs/users/unsuspend": {
    route: "/acs/users/unsuspend"
    method: "POST"
    queryParams: {}
    jsonBody: {
      acs_user_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/acs/users/update": {
    route: "/acs/users/update"
    method: "PATCH" | "POST"
    queryParams: {}
    jsonBody: {
      access_schedule?:
        | {
            starts_at: string
            ends_at: string
          }
        | undefined
      acs_user_id: string
      full_name?: string | undefined
      /** Deprecated: use email_address. */
      email?: string | undefined
      phone_number?: string | undefined
      email_address?: string | undefined
      hid_acs_system_id?: string | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
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
        device_count?: number | undefined
        workspace_id: string
        token: string
        user_identity_ids: string[]
        connect_webview_ids: string[]
        connected_account_ids: string[]
        created_at: string
        expires_at: string
        user_identifier_key?: string | undefined
        publishable_key?: string | undefined
        api_key_id?: string | undefined
        revoked_at?: string | undefined
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
        device_count?: number | undefined
        workspace_id: string
        token: string
        user_identity_ids: string[]
        connect_webview_ids: string[]
        connected_account_ids: string[]
        created_at: string
        expires_at: string
        user_identifier_key?: string | undefined
        publishable_key?: string | undefined
        api_key_id?: string | undefined
        revoked_at?: string | undefined
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
        device_count?: number | undefined
        workspace_id: string
        token: string
        user_identity_ids: string[]
        connect_webview_ids: string[]
        connected_account_ids: string[]
        created_at: string
        expires_at: string
        user_identifier_key?: string | undefined
        publishable_key?: string | undefined
        api_key_id?: string | undefined
        revoked_at?: string | undefined
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
        any_device_allowed: boolean
        login_successful: boolean
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        automatically_manage_new_devices: boolean
        wait_for_device_creation: boolean
        accepted_capabilities: string[]
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
        any_device_allowed: boolean
        login_successful: boolean
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        automatically_manage_new_devices: boolean
        wait_for_device_creation: boolean
        accepted_capabilities: string[]
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
        any_device_allowed: boolean
        login_successful: boolean
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        automatically_manage_new_devices: boolean
        wait_for_device_creation: boolean
        accepted_capabilities: string[]
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
    commonParams:
      | {
          connected_account_id: string
        }
      | {
          email: string
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
        display_name: string
        account_type?: string | undefined
        account_type_display_name: string
        automatically_manage_new_devices: boolean
        custom_metadata?:
          | {
              [x: string]: string | number | null | boolean
            }
          | undefined
        assa_abloy_credential_service_id?: string | undefined
        bridge_id: string | null
        accepted_capabilities: string[]
      }
      ok: boolean
    }
  }
  "/connected_accounts/list": {
    route: "/connected_accounts/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      limit?: number
      page_cursor?: (string | undefined) | null
    }
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
        display_name: string
        account_type?: string | undefined
        account_type_display_name: string
        automatically_manage_new_devices: boolean
        custom_metadata?:
          | {
              [x: string]: string | number | null | boolean
            }
          | undefined
        assa_abloy_credential_service_id?: string | undefined
        bridge_id: string | null
        accepted_capabilities: string[]
      }[]
      pagination: {
        has_next_page: boolean
        next_page_cursor: string | null
        next_page_url: string | null
      }
      ok: boolean
    }
  }
  "/connected_accounts/update": {
    route: "/connected_accounts/update"
    method: "POST"
    queryParams: {}
    jsonBody: {
      connected_account_id: string
      automatically_manage_new_devices?: boolean | undefined
      custom_metadata?:
        | {
            [x: string]: string | number | null | boolean
          }
        | undefined
    }
    commonParams: {}
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
        display_name: string
        account_type?: string | undefined
        account_type_display_name: string
        automatically_manage_new_devices: boolean
        custom_metadata?:
          | {
              [x: string]: string | number | null | boolean
            }
          | undefined
        assa_abloy_credential_service_id?: string | undefined
        bridge_id: string | null
        accepted_capabilities: string[]
      }
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
        display_name: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
          | ("ios_phone" | "android_phone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key?: string | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit?: boolean | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete?: boolean | undefined
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: ((string | null) | undefined) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name?: string | undefined
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?:
                  | (("auto" | "on" | "circulate") | undefined)
                  | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: (number | undefined) | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed?: boolean | undefined
              }
              default_climate_setting?:
                | {
                    /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    climate_preset_key?: string | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                    can_edit?: boolean | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                    can_delete?: boolean | undefined
                    /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    name?: ((string | null) | undefined) | undefined
                    /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    display_name?: string | undefined
                    /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                    fan_mode_setting?:
                      | (("auto" | "on" | "circulate") | undefined)
                      | undefined
                    /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                    hvac_mode_setting?:
                      | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                      | undefined
                    /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                     * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              fan_mode_setting: "auto" | "on"
              available_climate_presets: {
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key: string
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit: boolean
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete: boolean
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: (string | null) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name: string
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?: ("auto" | "on" | "circulate") | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | ("off" | "heat" | "cool" | "heat_cool")
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: number | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: number | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed: boolean
              }[]
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
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              noise_level_decibels?: number | undefined
              currently_triggering_noise_threshold_ids?: string[] | undefined
              minut_metadata?:
                | {
                    device_id: string
                    device_name: string
                    latest_sensor_values: {
                      temperature: {
                        time: string
                        value: number
                      }
                      sound: {
                        time: string
                        value: number
                      }
                      humidity: {
                        time: string
                        value: number
                      }
                      pressure: {
                        time: string
                        value: number
                      }
                      accelerometer_z: {
                        time: string
                        value: number
                      }
                    }
                  }
                | undefined
              noiseaware_metadata?:
                | {
                    device_model: "indoor" | "outdoor"
                    noise_level_nrs: number
                    noise_level_decibel: number
                    device_name: string
                    device_id: string
                  }
                | undefined
            }
        location?: any
        connected_account_id?: string | undefined
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
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        space_ids: string[]
        can_remotely_lock?: boolean | undefined
        can_remotely_unlock?: boolean | undefined
        can_program_online_access_codes?: boolean | undefined
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
            | ("ios_phone" | "android_phone")
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
            | ("ios_phone" | "android_phone")
          )[]
        | undefined
      manufacturer?: string | undefined
      limit?: number
      page_cursor?: (string | undefined) | null
    }
    formData: {}
    jsonResponse: {
      devices: {
        device_id: string
        display_name: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
          | ("ios_phone" | "android_phone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key?: string | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit?: boolean | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete?: boolean | undefined
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: ((string | null) | undefined) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name?: string | undefined
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?:
                  | (("auto" | "on" | "circulate") | undefined)
                  | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: (number | undefined) | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed?: boolean | undefined
              }
              default_climate_setting?:
                | {
                    /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    climate_preset_key?: string | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                    can_edit?: boolean | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                    can_delete?: boolean | undefined
                    /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    name?: ((string | null) | undefined) | undefined
                    /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    display_name?: string | undefined
                    /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                    fan_mode_setting?:
                      | (("auto" | "on" | "circulate") | undefined)
                      | undefined
                    /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                    hvac_mode_setting?:
                      | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                      | undefined
                    /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                     * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              fan_mode_setting: "auto" | "on"
              available_climate_presets: {
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key: string
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit: boolean
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete: boolean
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: (string | null) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name: string
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?: ("auto" | "on" | "circulate") | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | ("off" | "heat" | "cool" | "heat_cool")
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: number | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: number | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed: boolean
              }[]
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
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              noise_level_decibels?: number | undefined
              currently_triggering_noise_threshold_ids?: string[] | undefined
              minut_metadata?:
                | {
                    device_id: string
                    device_name: string
                    latest_sensor_values: {
                      temperature: {
                        time: string
                        value: number
                      }
                      sound: {
                        time: string
                        value: number
                      }
                      humidity: {
                        time: string
                        value: number
                      }
                      pressure: {
                        time: string
                        value: number
                      }
                      accelerometer_z: {
                        time: string
                        value: number
                      }
                    }
                  }
                | undefined
              noiseaware_metadata?:
                | {
                    device_model: "indoor" | "outdoor"
                    noise_level_nrs: number
                    noise_level_decibel: number
                    device_name: string
                    device_id: string
                  }
                | undefined
            }
        location?: any
        connected_account_id?: string | undefined
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
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        space_ids: string[]
        can_remotely_lock?: boolean | undefined
        can_remotely_unlock?: boolean | undefined
        can_program_online_access_codes?: boolean | undefined
      }[]
      pagination: {
        has_next_page: boolean
        next_page_cursor: string | null
        next_page_url: string | null
      }
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
          | ("ios_phone" | "android_phone")
        connected_account_id?: string | undefined
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
            | ("ios_phone" | "android_phone")
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
            | ("ios_phone" | "android_phone")
          )[]
        | undefined
      manufacturer?: string | undefined
      limit?: number
      page_cursor?: (string | undefined) | null
    }
    formData: {}
    jsonResponse: {
      devices: {
        device_id: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
          | ("ios_phone" | "android_phone")
        connected_account_id?: string | undefined
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
        event_description: string
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
        event_description: string
      }[]
      ok: boolean
    }
  }
  "/health": {
    route: "/health"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
      msg: "I\u2019m one with the Force. The Force is with me."
      last_service_evaluation_at?: string | undefined
      service_health_statuses: {
        service: string
        status: "healthy" | "degraded" | "down"
        description: string
      }[]
    }
  }
  "/health/get_health": {
    route: "/health/get_health"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
      msg: "I\u2019m one with the Force. The Force is with me."
      last_service_evaluation_at?: string | undefined
      service_health_statuses: {
        service: string
        status: "healthy" | "degraded" | "down"
        description: string
      }[]
    }
  }
  "/internal/api_keys/create": {
    route: "/internal/api_keys/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      name: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      api_key: {
        api_key_id: string
        name: string
        token: string
        short_token: string
        created_at: string
        workspace_id: string
      }
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
  "/internal/integration_fixturing/create_user_with_pat": {
    route: "/internal/integration_fixturing/create_user_with_pat"
    method: "POST" | "PUT"
    queryParams: {}
    jsonBody: {
      email: string
      access_token_name: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      user_with_pat: {
        user_id: string
        pat: string
      }
      ok: boolean
    }
  }
  "/internal/phone/deactivate": {
    route: "/internal/phone/deactivate"
    method: "DELETE" | "POST"
    queryParams: {}
    jsonBody: {
      custom_sdk_installation_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/internal/phone/user_identities/create_invitations": {
    route: "/internal/phone/user_identities/create_invitations"
    method: "POST"
    queryParams: {}
    jsonBody: {
      custom_sdk_installation_id: string
      phone_os: "ios" | "android"
      phone_device_metadata?:
        | {
            os_version?: string | undefined
            manufacturer?: string | undefined
            model?: string | undefined
          }
        | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      invitations: (
        | {
            invitation_type: "assa_abloy_credential_service"
            invitation_id: string
            ext_assa_abloy_cs_endpoint_id?: string | undefined
          }
        | {
            invitation_type: "hid_credential_manager"
            invitation_id: string
          }
      )[]
      ok: boolean
    }
  }
  "/internal/phone/user_identities/get_invitation": {
    route: "/internal/phone/user_identities/get_invitation"
    method: "POST"
    queryParams: {}
    jsonBody: {
      custom_sdk_installation_id: string
      invitation_id: string
      invitation_type:
        | "hid_credential_manager"
        | "assa_abloy_credential_service"
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      invitation:
        | {
            invitation_type: "hid_credential_manager"
            invitation_id: string
            invitation_code?: string | undefined
          }
        | {
            invitation_type: "assa_abloy_credential_service"
            invitation_id: string
            invitation_code?: string | undefined
            ext_assa_abloy_cs_endpoint_id?: string | undefined
          }
      ok: boolean
    }
  }
  "/internal/phone/user_identities/list_endpoints": {
    route: "/internal/phone/user_identities/list_endpoints"
    method: "POST"
    queryParams: {}
    jsonBody: {
      custom_sdk_installation_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      endpoints: (
        | {
            endpoint_type: "hid_credential_manager"
            endpoint_id: string
          }
        | {
            endpoint_type: "assa_abloy_credential_service"
            endpoint_id: string
            is_active: boolean
            seos_tsm_endpoint_id: number | null
          }
      )[]
      ok: boolean
    }
  }
  "/internal/phone/user_identities/load_credentials": {
    route: "/internal/phone/user_identities/load_credentials"
    method: "POST"
    queryParams: {}
    jsonBody: {
      hid_invitation_id?: (string | undefined) | null
      hid_credential_container_id?: (string | undefined) | null
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      internal_loaded_credentials: {
        hid_invitations: {
          invitation_id: string
          invitation_code?: string | undefined
        }[]
        hid_credential_container?:
          | {
              ext_hid_credential_container_id: string
            }
          | undefined
      }
      ok: boolean
    }
  }
  "/internal/phone/user_identities/prepare_endpoint": {
    route: "/internal/phone/user_identities/prepare_endpoint"
    method: "POST"
    queryParams: {}
    jsonBody: {
      custom_sdk_installation_id: string
      endpoint_id: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      endpoint?:
        | (
            | {
                endpoint_type: "hid_credential_manager"
                endpoint_id: string
              }
            | {
                endpoint_type: "assa_abloy_credential_service"
                endpoint_id: string
                is_active: boolean
                seos_tsm_endpoint_id: number | null
              }
          )
        | undefined
      ok: boolean
    }
  }
  "/internal/phone/visionline/list_lock_service_codes": {
    route: "/internal/phone/visionline/list_lock_service_codes"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      list_lock_service_codes_response: {
        lock_service_codes: string[]
      }
      ok: boolean
    }
  }
  "/internal/sandbox/[workspace_id]/visionline/_fake/load_credentials": {
    route: "/internal/sandbox/[workspace_id]/visionline/_fake/load_credentials"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      endpoint_id: string
    }
    formData: {}
    jsonResponse: {
      cards: {
        cancelled: boolean
        cardHolder: string
        created: string
        discarded: boolean
        doorOperations: {
          doors: string[]
          operation: "guest"
        }[]
        expireTime: string
        endpointId: string
        expired: boolean
        format: "TLCode" | "rfid48"
        id: string
        notIssued: boolean
        numberOfIssuedCards: number
        overridden: boolean
        overwritten: boolean
        pendingAutoUpdate: boolean
        serialNumbers: string[]
        startTime: string
        uniqueRegistrationNumber: number
        credentialID: number
      }[]
      ok: boolean
    }
  }
  "/internal/sandbox/[workspace_id]/visionline/_fake/redeem_invite_code": {
    route: "/internal/sandbox/[workspace_id]/visionline/_fake/redeem_invite_code"
    method: "POST"
    queryParams: {}
    jsonBody: {
      invite_code: string
      endpoint_details: {
        ble_capability: boolean
        hce_capability: boolean
        nfc_capability: boolean
        device_manufacturer: string
        application_version: string
        device_model: string
        seos_applet_version: string
        os_version: string
      }
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      endpoint: {
        endpoint_id: string
        invite_code: string
        status:
          | "INVITATION_PENDING"
          | "INVITATION_INVALID"
          | "ACKNOWLEDGED"
          | "ACTIVATING"
          | "ACTIVATION_FAILURE"
          | "ACTIVE"
          | "TERMINATED"
          | "TERMINATING_FAILURE"
        details?:
          | (
              | {
                  ble_capability: boolean
                  hce_capability: boolean
                  nfc_capability: boolean
                  device_manufacturer: string
                  application_version: string
                  device_model: string
                  seos_applet_version: string
                  os_version: string
                  seos_tsm_endpoint_id: number
                }
              | {
                  seos_tsm_endpoint_id: number
                }
            )
          | undefined
      }
      ok: boolean
    }
  }
  "/internal/sandbox/[workspace_id]/visionline/_fake/simulate/readers/list_events": {
    route: "/internal/sandbox/[workspace_id]/visionline/_fake/simulate/readers/list_events"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      reader_id: number
    }
    formData: {}
    jsonResponse: {
      events: {
        simulated_event_type: "tap"
        reader_id: number
        card_number: string
        timestamp: string
      }[]
      ok: boolean
    }
  }
  "/internal/sandbox/[workspace_id]/visionline/_fake/simulate/readers/unlock": {
    route: "/internal/sandbox/[workspace_id]/visionline/_fake/simulate/readers/unlock"
    method: "POST"
    queryParams: {}
    jsonBody: {
      reader_id: number
      tap?: boolean | undefined
      credential: {
        format: {
          name: string
        }
        card_number: string
        facility_code?: string | undefined
      }
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
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
        display_name: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
          | ("ios_phone" | "android_phone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key?: string | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit?: boolean | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete?: boolean | undefined
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: ((string | null) | undefined) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name?: string | undefined
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?:
                  | (("auto" | "on" | "circulate") | undefined)
                  | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: (number | undefined) | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed?: boolean | undefined
              }
              default_climate_setting?:
                | {
                    /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    climate_preset_key?: string | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                    can_edit?: boolean | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                    can_delete?: boolean | undefined
                    /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    name?: ((string | null) | undefined) | undefined
                    /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    display_name?: string | undefined
                    /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                    fan_mode_setting?:
                      | (("auto" | "on" | "circulate") | undefined)
                      | undefined
                    /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                    hvac_mode_setting?:
                      | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                      | undefined
                    /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                     * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              fan_mode_setting: "auto" | "on"
              available_climate_presets: {
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key: string
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit: boolean
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete: boolean
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: (string | null) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name: string
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?: ("auto" | "on" | "circulate") | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | ("off" | "heat" | "cool" | "heat_cool")
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: number | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: number | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed: boolean
              }[]
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
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              noise_level_decibels?: number | undefined
              currently_triggering_noise_threshold_ids?: string[] | undefined
              minut_metadata?:
                | {
                    device_id: string
                    device_name: string
                    latest_sensor_values: {
                      temperature: {
                        time: string
                        value: number
                      }
                      sound: {
                        time: string
                        value: number
                      }
                      humidity: {
                        time: string
                        value: number
                      }
                      pressure: {
                        time: string
                        value: number
                      }
                      accelerometer_z: {
                        time: string
                        value: number
                      }
                    }
                  }
                | undefined
              noiseaware_metadata?:
                | {
                    device_model: "indoor" | "outdoor"
                    noise_level_nrs: number
                    noise_level_decibel: number
                    device_name: string
                    device_id: string
                  }
                | undefined
            }
        location?: any
        connected_account_id?: string | undefined
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
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        space_ids: string[]
        can_remotely_lock?: boolean | undefined
        can_remotely_unlock?: boolean | undefined
        can_program_online_access_codes?: boolean | undefined
      }
      device: {
        device_id: string
        display_name: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
          | ("ios_phone" | "android_phone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key?: string | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit?: boolean | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete?: boolean | undefined
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: ((string | null) | undefined) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name?: string | undefined
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?:
                  | (("auto" | "on" | "circulate") | undefined)
                  | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: (number | undefined) | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed?: boolean | undefined
              }
              default_climate_setting?:
                | {
                    /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    climate_preset_key?: string | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                    can_edit?: boolean | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                    can_delete?: boolean | undefined
                    /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    name?: ((string | null) | undefined) | undefined
                    /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    display_name?: string | undefined
                    /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                    fan_mode_setting?:
                      | (("auto" | "on" | "circulate") | undefined)
                      | undefined
                    /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                    hvac_mode_setting?:
                      | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                      | undefined
                    /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                     * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              fan_mode_setting: "auto" | "on"
              available_climate_presets: {
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key: string
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit: boolean
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete: boolean
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: (string | null) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name: string
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?: ("auto" | "on" | "circulate") | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | ("off" | "heat" | "cool" | "heat_cool")
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: number | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: number | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed: boolean
              }[]
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
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              noise_level_decibels?: number | undefined
              currently_triggering_noise_threshold_ids?: string[] | undefined
              minut_metadata?:
                | {
                    device_id: string
                    device_name: string
                    latest_sensor_values: {
                      temperature: {
                        time: string
                        value: number
                      }
                      sound: {
                        time: string
                        value: number
                      }
                      humidity: {
                        time: string
                        value: number
                      }
                      pressure: {
                        time: string
                        value: number
                      }
                      accelerometer_z: {
                        time: string
                        value: number
                      }
                    }
                  }
                | undefined
              noiseaware_metadata?:
                | {
                    device_model: "indoor" | "outdoor"
                    noise_level_nrs: number
                    noise_level_decibel: number
                    device_name: string
                    device_id: string
                  }
                | undefined
            }
        location?: any
        connected_account_id?: string | undefined
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
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        space_ids: string[]
        can_remotely_lock?: boolean | undefined
        can_remotely_unlock?: boolean | undefined
        can_program_online_access_codes?: boolean | undefined
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
            | ("ios_phone" | "android_phone")
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
            | ("ios_phone" | "android_phone")
          )[]
        | undefined
      manufacturer?: string | undefined
      limit?: number
      page_cursor?: (string | undefined) | null
    }
    formData: {}
    jsonResponse: {
      locks: {
        device_id: string
        display_name: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
          | ("ios_phone" | "android_phone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key?: string | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit?: boolean | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete?: boolean | undefined
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: ((string | null) | undefined) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name?: string | undefined
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?:
                  | (("auto" | "on" | "circulate") | undefined)
                  | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: (number | undefined) | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed?: boolean | undefined
              }
              default_climate_setting?:
                | {
                    /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    climate_preset_key?: string | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                    can_edit?: boolean | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                    can_delete?: boolean | undefined
                    /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    name?: ((string | null) | undefined) | undefined
                    /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    display_name?: string | undefined
                    /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                    fan_mode_setting?:
                      | (("auto" | "on" | "circulate") | undefined)
                      | undefined
                    /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                    hvac_mode_setting?:
                      | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                      | undefined
                    /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                     * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              fan_mode_setting: "auto" | "on"
              available_climate_presets: {
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key: string
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit: boolean
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete: boolean
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: (string | null) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name: string
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?: ("auto" | "on" | "circulate") | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | ("off" | "heat" | "cool" | "heat_cool")
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: number | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: number | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed: boolean
              }[]
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
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              noise_level_decibels?: number | undefined
              currently_triggering_noise_threshold_ids?: string[] | undefined
              minut_metadata?:
                | {
                    device_id: string
                    device_name: string
                    latest_sensor_values: {
                      temperature: {
                        time: string
                        value: number
                      }
                      sound: {
                        time: string
                        value: number
                      }
                      humidity: {
                        time: string
                        value: number
                      }
                      pressure: {
                        time: string
                        value: number
                      }
                      accelerometer_z: {
                        time: string
                        value: number
                      }
                    }
                  }
                | undefined
              noiseaware_metadata?:
                | {
                    device_model: "indoor" | "outdoor"
                    noise_level_nrs: number
                    noise_level_decibel: number
                    device_name: string
                    device_id: string
                  }
                | undefined
            }
        location?: any
        connected_account_id?: string | undefined
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
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        space_ids: string[]
        can_remotely_lock?: boolean | undefined
        can_remotely_unlock?: boolean | undefined
        can_program_online_access_codes?: boolean | undefined
      }[]
      devices: {
        device_id: string
        display_name: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
          | ("ios_phone" | "android_phone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key?: string | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit?: boolean | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete?: boolean | undefined
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: ((string | null) | undefined) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name?: string | undefined
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?:
                  | (("auto" | "on" | "circulate") | undefined)
                  | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: (number | undefined) | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed?: boolean | undefined
              }
              default_climate_setting?:
                | {
                    /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    climate_preset_key?: string | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                    can_edit?: boolean | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                    can_delete?: boolean | undefined
                    /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    name?: ((string | null) | undefined) | undefined
                    /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    display_name?: string | undefined
                    /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                    fan_mode_setting?:
                      | (("auto" | "on" | "circulate") | undefined)
                      | undefined
                    /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                    hvac_mode_setting?:
                      | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                      | undefined
                    /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                     * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              fan_mode_setting: "auto" | "on"
              available_climate_presets: {
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key: string
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit: boolean
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete: boolean
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: (string | null) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name: string
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?: ("auto" | "on" | "circulate") | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | ("off" | "heat" | "cool" | "heat_cool")
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: number | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: number | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed: boolean
              }[]
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
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              noise_level_decibels?: number | undefined
              currently_triggering_noise_threshold_ids?: string[] | undefined
              minut_metadata?:
                | {
                    device_id: string
                    device_name: string
                    latest_sensor_values: {
                      temperature: {
                        time: string
                        value: number
                      }
                      sound: {
                        time: string
                        value: number
                      }
                      humidity: {
                        time: string
                        value: number
                      }
                      pressure: {
                        time: string
                        value: number
                      }
                      accelerometer_z: {
                        time: string
                        value: number
                      }
                    }
                  }
                | undefined
              noiseaware_metadata?:
                | {
                    device_model: "indoor" | "outdoor"
                    noise_level_nrs: number
                    noise_level_decibel: number
                    device_name: string
                    device_id: string
                  }
                | undefined
            }
        location?: any
        connected_account_id?: string | undefined
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
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        space_ids: string[]
        can_remotely_lock?: boolean | undefined
        can_remotely_unlock?: boolean | undefined
        can_program_online_access_codes?: boolean | undefined
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
  "/seam/bridge/v1/bridge_client_sessions/create": {
    route: "/seam/bridge/v1/bridge_client_sessions/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      bridge_client_name: string
      bridge_client_time_zone: string
      bridge_client_machine_identifier_key: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      bridge_client_session: {
        created_at: string
        bridge_client_session_id: string
        bridge_client_session_token: string
        _ext_tailscale_auth_key_id: string | null
        pairing_code: string
        pairing_code_expires_at: string
        tailscale_hostname: string
        tailscale_auth_key: string | null
        _tailscale_auth_key_expires_at: string | null
        bridge_client_name: string
        bridge_client_time_zone: string
        bridge_client_machine_identifier_key: string
        _last_status_report_received_at: string | null
      }
      ok: boolean
    }
  }
  "/seam/bridge/v1/bridge_client_sessions/get": {
    route: "/seam/bridge/v1/bridge_client_sessions/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      bridge_client_session: {
        created_at: string
        bridge_client_session_id: string
        bridge_client_session_token: string
        _ext_tailscale_auth_key_id: string | null
        pairing_code: string
        pairing_code_expires_at: string
        tailscale_hostname: string
        tailscale_auth_key: string | null
        _tailscale_auth_key_expires_at: string | null
        bridge_client_name: string
        bridge_client_time_zone: string
        bridge_client_machine_identifier_key: string
        _last_status_report_received_at: string | null
      }
      ok: boolean
    }
  }
  "/seam/bridge/v1/bridge_client_sessions/regenerate_pairing_code": {
    route: "/seam/bridge/v1/bridge_client_sessions/regenerate_pairing_code"
    method: "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      bridge_client_session: {
        created_at: string
        bridge_client_session_id: string
        bridge_client_session_token: string
        _ext_tailscale_auth_key_id: string | null
        pairing_code: string
        pairing_code_expires_at: string
        tailscale_hostname: string
        tailscale_auth_key: string | null
        _tailscale_auth_key_expires_at: string | null
        bridge_client_name: string
        bridge_client_time_zone: string
        bridge_client_machine_identifier_key: string
        _last_status_report_received_at: string | null
      }
      ok: boolean
    }
  }
  "/seam/bridge/v1/bridge_client_sessions/report_status": {
    route: "/seam/bridge/v1/bridge_client_sessions/report_status"
    method: "POST"
    queryParams: {}
    jsonBody: {
      is_tailscale_connected: boolean | null
      tailscale_ip_v4: string | null
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/seam/bridge/v1/bridge_connected_systems/list": {
    route: "/seam/bridge/v1/bridge_connected_systems/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      bridge_connected_systems: {
        bridge_id: string
        bridge_created_at: string
        connected_account_id: string
        connected_account_created_at: string
        acs_system_id: string
        acs_system_display_name: string
        workspace_id: string
        workspace_display_name: string
      }[]
      ok: boolean
    }
  }
  "/thermostats/activate_climate_preset": {
    route: "/thermostats/activate_climate_preset"
    method: "POST"
    queryParams: {}
    jsonBody: {
      /** ID of the desired thermostat device. */
      device_id: string
      /** Climate preset key of the desired climate preset. */
      climate_preset_key: string
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
  "/thermostats/create_climate_preset": {
    route: "/thermostats/create_climate_preset"
    method: "POST"
    queryParams: {}
    jsonBody: {
      /** ID of the desired thermostat device. */
      device_id: string
      /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
      climate_preset_key: string
      /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
      name?: (string | null) | undefined
      /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
      fan_mode_setting?: ("auto" | "on" | "circulate") | undefined
      /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
      hvac_mode_setting?: ("off" | "heat" | "cool" | "heat_cool") | undefined
      /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
      cooling_set_point_celsius?: number | undefined
      /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
      heating_set_point_celsius?: number | undefined
      /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
      cooling_set_point_fahrenheit?: number | undefined
      /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
      heating_set_point_fahrenheit?: number | undefined
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/thermostats/delete_climate_preset": {
    route: "/thermostats/delete_climate_preset"
    method: "POST" | "DELETE"
    queryParams: {}
    jsonBody: {
      /** ID of the desired thermostat device. */
      device_id: string
      /** Climate preset key of the desired climate preset. */
      climate_preset_key: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
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
        display_name: string
        device_type:
          | ("august_lock" | "schlage_lock" | "yale_lock" | "smartthings_lock")
          | ("nest_thermostat" | "ecobee_thermostat")
          | ("minut_sensor" | "noiseaware_activity_zone")
          | ("ios_phone" | "android_phone")
        capabilities_supported: string[]
        properties:
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
              appearance: {
                name: string
              }
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
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key?: string | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit?: boolean | undefined
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete?: boolean | undefined
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: ((string | null) | undefined) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name?: string | undefined
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?:
                  | (("auto" | "on" | "circulate") | undefined)
                  | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: (number | undefined) | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: (number | undefined) | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: (number | undefined) | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed?: boolean | undefined
              }
              default_climate_setting?:
                | {
                    /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    climate_preset_key?: string | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                    can_edit?: boolean | undefined
                    /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                    can_delete?: boolean | undefined
                    /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    name?: ((string | null) | undefined) | undefined
                    /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                    display_name?: string | undefined
                    /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                    fan_mode_setting?:
                      | (("auto" | "on" | "circulate") | undefined)
                      | undefined
                    /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                    hvac_mode_setting?:
                      | (("off" | "heat" | "cool" | "heat_cool") | undefined)
                      | undefined
                    /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_celsius?: (number | undefined) | undefined
                    /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    cooling_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                    heating_set_point_fahrenheit?:
                      | (number | undefined)
                      | undefined
                    /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                     * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                    manual_override_allowed?: boolean | undefined
                  }
                | undefined
              fan_mode_setting: "auto" | "on"
              available_climate_presets: {
                /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                climate_preset_key: string
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be edited. */
                can_edit: boolean
                /** Indicates whether the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets) key can be deleted. */
                can_delete: boolean
                /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                name?: (string | null) | undefined
                /** Display name for the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
                display_name: string
                /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
                fan_mode_setting?: ("auto" | "on" | "circulate") | undefined
                /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
                hvac_mode_setting?:
                  | ("off" | "heat" | "cool" | "heat_cool")
                  | undefined
                /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_celsius?: number | undefined
                /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                cooling_set_point_fahrenheit?: number | undefined
                /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
                heating_set_point_fahrenheit?: number | undefined
                /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
                 * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
                manual_override_allowed: boolean
              }[]
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
          | {
              online: boolean
              name: string
              appearance: {
                name: string
              }
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
              noise_level_decibels?: number | undefined
              currently_triggering_noise_threshold_ids?: string[] | undefined
              minut_metadata?:
                | {
                    device_id: string
                    device_name: string
                    latest_sensor_values: {
                      temperature: {
                        time: string
                        value: number
                      }
                      sound: {
                        time: string
                        value: number
                      }
                      humidity: {
                        time: string
                        value: number
                      }
                      pressure: {
                        time: string
                        value: number
                      }
                      accelerometer_z: {
                        time: string
                        value: number
                      }
                    }
                  }
                | undefined
              noiseaware_metadata?:
                | {
                    device_model: "indoor" | "outdoor"
                    noise_level_nrs: number
                    noise_level_decibel: number
                    device_name: string
                    device_id: string
                  }
                | undefined
            }
        location?: any
        connected_account_id?: string | undefined
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
        custom_metadata: {
          [x: string]: string | number | null | boolean
        }
        space_ids: string[]
        can_remotely_lock?: boolean | undefined
        can_remotely_unlock?: boolean | undefined
        can_program_online_access_codes?: boolean | undefined
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
  "/thermostats/update_climate_preset": {
    route: "/thermostats/update_climate_preset"
    method: "POST" | "PATCH"
    queryParams: {}
    jsonBody: {
      /** ID of the desired thermostat device. */
      device_id: string
      /** Unique key to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
      climate_preset_key: string
      /** User-friendly name to identify the [climate preset](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-climate-presets). */
      name?: (string | null) | undefined
      /** Desired [fan mode setting](https://docs.seam.co/latest/capability-guides/thermostats/configure-current-climate-settings#fan-mode-settings), such as `on`, `auto`, or `circulate`. */
      fan_mode_setting?: ("auto" | "on" | "circulate") | undefined
      /** Desired [HVAC mode](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/hvac-mode) setting, such as `heat`, `cool`, `heat_cool`, or `off`. */
      hvac_mode_setting?: ("off" | "heat" | "cool" | "heat_cool") | undefined
      /** Temperature to which the thermostat should cool (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
      cooling_set_point_celsius?: number | undefined
      /** Temperature to which the thermostat should heat (in °C). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
      heating_set_point_celsius?: number | undefined
      /** Temperature to which the thermostat should cool (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
      cooling_set_point_fahrenheit?: number | undefined
      /** Temperature to which the thermostat should heat (in °F). See also [Set Points](https://docs.seam.co/latest/capability-guides/thermostats/understanding-thermostat-concepts/set-points). */
      heating_set_point_fahrenheit?: number | undefined
      /** Indicates whether a person at the thermostat can change the thermostat's settings. See [Specifying Manual Override Permissions](https://docs.seam.co/latest/capability-guides/thermostats/creating-and-managing-thermostat-schedules#specifying-manual-override-permissions).
       * @deprecated Use 'thermostat_schedule.is_override_allowed'*/
      manual_override_allowed: boolean
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/user_identities/add_acs_user": {
    route: "/user_identities/add_acs_user"
    method: "POST" | "PUT"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      user_identity_id: string
      acs_user_id: string
    }
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/user_identities/create": {
    route: "/user_identities/create"
    method: "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      user_identity_key?: (string | null) | undefined
      email_address?: (string | null) | undefined
      full_name?: (string | null) | undefined
    }
    formData: {}
    jsonResponse: {
      user_identity: {
        user_identity_id: string
        user_identity_key: string | null
        email_address: string | null
        display_name: string
        full_name: string | null
        created_at: string
        workspace_id: string
      }
      ok: boolean
    }
  }
  "/webhooks/create": {
    route: "/webhooks/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      url: string
      event_types?: string[]
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      webhook: {
        webhook_id: string
        url: string
        event_types?: string[] | undefined
        secret?: string | undefined
        created_at: string
      }
      ok: boolean
    }
  }
  "/webhooks/delete": {
    route: "/webhooks/delete"
    method: "DELETE" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      webhook_id: string
    }
    formData: {}
    jsonResponse: {
      ok: boolean
    }
  }
  "/webhooks/get": {
    route: "/webhooks/get"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {
      webhook_id: string
    }
    formData: {}
    jsonResponse: {
      webhook: {
        webhook_id: string
        url: string
        event_types?: string[] | undefined
        secret?: string | undefined
        created_at: string
      }
      ok: boolean
    }
  }
  "/webhooks/list": {
    route: "/webhooks/list"
    method: "GET" | "POST"
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      webhooks: {
        webhook_id: string
        url: string
        event_types?: string[] | undefined
        secret?: string | undefined
        created_at: string
      }[]
      ok: boolean
    }
  }
  "/workspaces/create": {
    route: "/workspaces/create"
    method: "POST"
    queryParams: {}
    jsonBody: {
      connect_partner_name: string
      is_sandbox: boolean
      webview_primary_button_color?: string | undefined
      webview_logo_shape?: ("circle" | "square") | undefined
      name: string
    }
    commonParams: {}
    formData: {}
    jsonResponse: {
      workspace: {
        workspace_id: string
        name: string
        created_at: string
        is_sandbox: boolean
        publishable_key: string
        is_publishable_key_auth_enabled: boolean
        is_suspended: boolean
        company_name: string
        /** deprecated: use company_name */
        connect_partner_name: string | null
        connect_webview_customization: {
          primary_button_color?: string | undefined
          primary_button_text_color?: string | undefined
          success_message?: string | undefined
          logo_shape?: ("circle" | "square") | undefined
          inviter_logo_url?: string | undefined
        }
      }
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
        created_at: string
        is_sandbox: boolean
        publishable_key: string
        is_publishable_key_auth_enabled: boolean
        is_suspended: boolean
        company_name: string
        /** deprecated: use company_name */
        connect_partner_name: string | null
        connect_webview_customization: {
          primary_button_color?: string | undefined
          primary_button_text_color?: string | undefined
          success_message?: string | undefined
          logo_shape?: ("circle" | "square") | undefined
          inviter_logo_url?: string | undefined
        }
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
        created_at: string
        is_sandbox: boolean
        publishable_key: string
        is_publishable_key_auth_enabled: boolean
        is_suspended: boolean
        company_name: string
        /** deprecated: use company_name */
        connect_partner_name: string | null
        connect_webview_customization: {
          primary_button_color?: string | undefined
          primary_button_text_color?: string | undefined
          success_message?: string | undefined
          logo_shape?: ("circle" | "square") | undefined
          inviter_logo_url?: string | undefined
        }
      }[]
      ok: boolean
    }
  }
  "/workspaces/reset_sandbox": {
    route: "/workspaces/reset_sandbox"
    method: "POST"
    queryParams: {}
    jsonBody: {}
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
}

export type RouteResponse<Path extends keyof Routes> =
  Routes[Path]["jsonResponse"]

export type RouteRequestBody<Path extends keyof Routes> =
  Routes[Path]["jsonBody"] & Routes[Path]["commonParams"]

export type RouteRequestParams<Path extends keyof Routes> =
  Routes[Path]["queryParams"] & Routes[Path]["commonParams"]
