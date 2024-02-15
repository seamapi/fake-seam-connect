import type { Endpoint, PublicEndpoint } from "lib/zod/endpoints.ts"

export function publicMapEndpoint(endpoint: Endpoint): PublicEndpoint {
  if (endpoint.endpoint_type === "hid_credential_manager") {
    return endpoint
  } else {
    return {
      endpoint_id: endpoint.endpoint_id,
      endpoint_type: endpoint.endpoint_type,
      is_active: endpoint.is_active,
      seos_tsm_endpoint_id: endpoint.seos_tsm_endpoint_id,
    }
  }
}
