import { hashLongToken } from "lib/tokens/generate-api-key.ts"

import type { Database } from "./schema.ts"

export interface Seed {
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
  john_user_identifier_key: "john_user_identifier_key"
  john_user_identity_id: "john_user_identity_id"
  john_user_id: "john_user_id"
  john_user_key: "john_user_key"
  visionline_acs_system_1: "visionline_acs_system_1"
  seam_at1_token: "seam_at1_longtoken"
  bridge_client_session_token: "bcs1_token"
}

export const seed: Seed = {
  john_connected_account_id: "john_connected_account_id",
  jane_connected_account_id: "jane_connected_account_id",
  john_assa_cs_connected_account_id: "john_assa_cs_connected_account_id",
  seed_workspace_1: "seed_workspace_1",
  seed_workspace_2: "seed_workspace_2",
  john_user_workspace_1: "john_user_workspace_1",
  august_device_1: "august_device_1",
  august_device_2: "august_device_2",
  ecobee_device_1: "ecobee_device_1",
  minut_device_1: "minut_device_1",
  schlage_device_1: "schlage_device_id",
  seam_apikey1_token: "seam_apikey1_token",
  seam_apikey2_token: "seam_apikey2_token",
  seam_cst1_token: "seam_cst1_token",
  seam_pk1_token: "seam_pk1_token",
  seam_at1_token: "seam_at1_longtoken",
  john_user_identifier_key: "john_user_identifier_key",
  john_user_identity_id: "john_user_identity_id",
  john_user_id: "john_user_id",
  john_user_key: "john_user_key",
  visionline_acs_system_1: "visionline_acs_system_1",
  bridge_client_session_token: "bcs1_token",
} as const

export const seedDatabase = (db: Database): Seed => {
  if (
    db.connected_accounts.some(
      (ca) => ca.user_identifier?.email === "john@example.com",
    )
  ) {
    throw new Error(
      "Database has already been seeded (already has john@example.com)",
    )
  }

  db.addWorkspace({
    name: "My Workspace",
    workspace_id: seed.seed_workspace_1,
    publishable_key: seed.seam_pk1_token,
    is_sandbox: true,
  })
  const api_key_1 = db.addApiKey({
    name: "Seed API Key 1",
    token: seed.seam_apikey1_token,
    workspace_id: seed.seed_workspace_1,
  })
  db.addWorkspace({
    name: "Empty Workspace",
    workspace_id: seed.seed_workspace_2,
  })
  db.addApiKey({
    name: "Seed API Key 2",
    token: seed.seam_apikey2_token,
    workspace_id: seed.seed_workspace_2,
  })

  const cw = db.addConnectWebview({
    workspace_id: seed.seed_workspace_1,
  })

  db.addUserSession({
    user_id: seed.john_user_id,
    is_admin_session: false,
    key: seed.john_user_key,
  })

  db.addUserWorkspace({
    user_workspace_id: seed.john_user_workspace_1,
    user_id: seed.john_user_id,
    workspace_id: seed.seed_workspace_1,
    is_owner: true,
  })

  db.addConnectedAccount({
    provider: "august",
    workspace_id: seed.seed_workspace_1,
    user_identifier: {
      email: "john@example.com",
    },
    connected_account_id: seed.john_connected_account_id,
  })

  db.updateConnectWebview({
    connect_webview_id: cw.connect_webview_id,
    connected_account_id: seed.john_connected_account_id,
    status: "authorized",
  })

  db.addDevice({
    device_id: seed.august_device_1,
    connected_account_id: seed.john_connected_account_id,
    device_type: "august_lock",
    name: "Front Door",
    workspace_id: seed.seed_workspace_1,
    can_remotely_lock: true,
    can_remotely_unlock: true,
    can_program_online_access_codes: true,
    properties: {
      name: "Fake August Lock 1",
      manufacturer: "august",
      locked: true,
    },
  })

  db.addEvent({
    event_type: "device.connected",
    workspace_id: seed.seed_workspace_1,
    connected_account_id: seed.john_connected_account_id,
    device_id: seed.august_device_1,
  })

  db.addDevice({
    device_id: seed.august_device_2,
    connected_account_id: seed.john_connected_account_id,
    device_type: "august_lock",
    name: "Back Door",
    workspace_id: seed.seed_workspace_1,
    can_remotely_lock: true,
    can_remotely_unlock: true,
    can_program_online_access_codes: true,
    properties: {
      name: "Fake August Lock 2",
      manufacturer: "august",
      locked: true,
    },
  })

  db.addDevice({
    device_id: seed.ecobee_device_1,
    connected_account_id: seed.john_connected_account_id,
    device_type: "ecobee_thermostat",
    name: "Thermostat 1",
    workspace_id: seed.seed_workspace_1,
    properties: {
      is_cooling_available: true,
      is_heating_available: true,
      min_heating_cooling_delta_celsius: 2.78,
      is_fan_running: true,
      fan_mode_setting: "auto",
      current_climate_setting: {
        automatic_heating_enabled: false,
        automatic_cooling_enabled: true,
        hvac_mode_setting: "cool",
        manual_override_allowed: true,
        cooling_set_point_celsius: 24,
        heating_set_point_celsius: 18,
      },
    },
  })

  db.addNoiseThreshold({
    device_id: seed.minut_device_1,
    noise_threshold_decibels: 60,
    name: "builtin_normal_hours",
    starts_daily_at: "00:00:00[America/Los_Angeles]",
    ends_daily_at: "23:59:59[America/Los_Angeles]",
  })

  db.addDevice({
    device_id: seed.minut_device_1,
    device_type: "minut_sensor",
    name: "Minut Sensor 1",
    connected_account_id: seed.john_connected_account_id,
    workspace_id: seed.seed_workspace_1,
    properties: {
      noise_level_decibels: 70,
    },
  })

  db.addConnectedAccount({
    provider: "schlage",
    workspace_id: seed.seed_workspace_1,
    user_identifier: {
      email: "jane@example.com",
    },
    connected_account_id: seed.jane_connected_account_id,
  })

  db.addDevice({
    device_id: seed.schlage_device_1,
    connected_account_id: seed.jane_connected_account_id,
    device_type: "schlage_lock",
    name: "Bathroom Door",
    workspace_id: seed.seed_workspace_1,
    can_remotely_lock: true,
    can_remotely_unlock: true,
    can_program_online_access_codes: true,
    properties: {
      locked: true,
    },
  })

  db.addUserIdentity({
    workspace_id: seed.seed_workspace_1,
    user_identity_id: seed.john_user_identity_id,
    user_identity_key: seed.john_user_identifier_key,
    email_address: "jane@example.com",
  })

  db.addClientSession({
    workspace_id: seed.seed_workspace_1,
    connect_webview_ids: [cw.connect_webview_id],
    connected_account_ids: [seed.john_connected_account_id],
    user_identifier_key: seed.john_user_identifier_key,
    user_identity_ids: [seed.john_user_identity_id],
    token: seed.seam_cst1_token,
    api_key_id: api_key_1.api_key_id,
  })

  db.addBridgeClientSession({
    bridge_client_session_id: "bcs1",
    bridge_client_session_token: "bcs1_token",
    pairing_code: "123456",
    pairing_code_expires_at: new Date().toISOString(),
    tailscale_hostname: "bcs1_tailscale_host",
    tailscale_auth_key: null,
    bridge_client_name: "bridge_1",
    bridge_client_time_zone: "America/Los_Angeles",
    bridge_client_machine_identifier_key: "bcs1_machine",
  })

  const connected_account = db.addConnectedAccount({
    provider: "assa_abloy_credential_service",
    workspace_id: seed.seed_workspace_1,
    user_identifier: {
      email: "john@example.com",
    },
    connected_account_id: seed.john_assa_cs_connected_account_id,
  })

  if (connected_account.assa_abloy_credential_service_id !== undefined) {
    db.addEnrollmentAutomation({
      assa_abloy_credential_service_id:
        connected_account.assa_abloy_credential_service_id,
      user_identity_id: seed.john_user_identity_id,
      workspace_id: seed.seed_workspace_1,
      enrollment_automation_id: "john_assa_cs_enrollment_automation_id",
    })
  }

  db.addAcsSystem({
    acs_system_id: seed.visionline_acs_system_1,
    external_type: "visionline_system",
    name: "Fake Visionline System",
    workspace_id: seed.seed_workspace_1,
    connected_account_id: seed.john_connected_account_id,
  })

  const [, short_token = "", long_token = ""] = seed.seam_at1_token.split("_")
  const long_token_hash = hashLongToken(long_token)
  db.addAccessToken({
    access_token_name: "Seeded Fake Access Token",
    email: "john@example.com",
    user_id: seed.john_user_id,
    long_token_hash,
    short_token,
  })

  return seed
}
