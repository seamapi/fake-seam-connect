import type { Database } from "./schema.ts"

export interface Seed {
  john_connected_account_id: "john_connected_account_id"
  jane_connected_account_id: "jane_connected_account_id"
  john_assa_cs_connected_account_id: "john_assa_cs_connected_account_id"
  seed_workspace_1: "seed_workspace_1"
  seed_workspace_2: "seed_workspace_2"
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
  john_user_identity_id: string
  visionline_acs_system_1: "visionline_acs_system_1"
}

export const seed = (db: Database): Seed => {
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
    workspace_id: "seed_workspace_1",
    publishable_key: "seam_pk1_token",
    is_sandbox: true,
  })
  db.addApiKey({
    name: "Seed API Key 1",
    token: "seam_apikey1_token",
    workspace_id: "seed_workspace_1",
  })
  db.addWorkspace({
    name: "Empty Workspace",
    workspace_id: "seed_workspace_2",
  })
  db.addApiKey({
    name: "Seed API Key 2",
    token: "seam_apikey2_token",
    workspace_id: "seed_workspace_2",
  })

  const cw = db.addConnectWebview({
    workspace_id: "seed_workspace_1",
  })

  db.addConnectedAccount({
    provider: "august",
    workspace_id: "seed_workspace_1",
    user_identifier: {
      email: "john@example.com",
    },
    connected_account_id: "john_connected_account_id",
  })

  db.updateConnectWebview({
    connect_webview_id: cw.connect_webview_id,
    connected_account_id: "john_connected_account_id",
    status: "authorized",
  })

  db.addDevice({
    device_id: "august_device_1",
    connected_account_id: "john_connected_account_id",
    device_type: "august_lock",
    display_name: "Front Door",
    name: "Front Door",
    workspace_id: "seed_workspace_1",
    properties: {
      name: "Fake August Lock 1",
      manufacturer: "august",
      locked: true,
    },
  })

  db.addEvent({
    event_type: "device.connected",
    workspace_id: "seed_workspace_1",
    connected_account_id: "john_connected_account_id",
    device_id: "august_device_1",
  })

  db.addDevice({
    device_id: "august_device_2",
    connected_account_id: "john_connected_account_id",
    device_type: "august_lock",
    display_name: "Back Door",
    name: "Back Door",
    workspace_id: "seed_workspace_1",
    properties: {
      name: "Fake August Lock 2",
      manufacturer: "august",
      locked: true,
    },
  })

  db.addDevice({
    device_id: "ecobee_device_1",
    connected_account_id: "john_connected_account_id",
    device_type: "ecobee_thermostat",
    display_name: "Thermostat 1",
    name: "Thermostat 1",
    workspace_id: "seed_workspace_1",
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

  const minut_device = db.addDevice({
    device_id: "minut_device_1",
    device_type: "minut_sensor",
    display_name: "Minut Sensor 1",
    name: "Minut Sensor 1",
    connected_account_id: "john_connected_account_id",
    workspace_id: "seed_workspace_1",
  })
  db.addNoiseThreshold({
    device_id: minut_device.device_id,
    noise_threshold_decibels: 60,
    name: "builtin_normal_hours",
    starts_daily_at: "00:00:00[America/Los_Angeles]",
    ends_daily_at: "00:00:00[America/Los_Angeles]",
  })

  db.addConnectedAccount({
    provider: "schlage",
    workspace_id: "seed_workspace_1",
    user_identifier: {
      email: "jane@example.com",
    },
    connected_account_id: "jane_connected_account_id",
  })

  db.addDevice({
    device_id: "schlage_device_1",
    connected_account_id: "jane_connected_account_id",
    device_type: "schlage_lock",
    display_name: "Bathroom Door",
    name: "Bathroom Door",
    workspace_id: "seed_workspace_1",
    properties: {
      locked: true,
    },
  })

  db.addUserIdentity({
    workspace_id: "seed_workspace_1",
    user_identity_id: "john_user_identity_id",
    user_identity_key: "john_user_identifier_key",
    email_address: "jane@example.com",
  })

  db.addClientSession({
    workspace_id: "seed_workspace_1",
    connect_webview_ids: [cw.connect_webview_id],
    connected_account_ids: ["john_connected_account_id"],
    user_identifier_key: "john_user_identifier_key",
    user_identity_ids: ["john_user_identity_id"],
    token: "seam_cst1_token",
  })

  const connected_account = db.addConnectedAccount({
    provider: "assa_abloy_credential_service",
    workspace_id: "seed_workspace_1",
    user_identifier: {
      email: "john@example.com",
    },
    connected_account_id: "john_assa_cs_connected_account_id",
  })

  if (connected_account.assa_abloy_credential_service_id !== undefined) {
    db.addEnrollmentAutomation({
      assa_abloy_credential_service_id:
        connected_account.assa_abloy_credential_service_id,
      user_identity_id: "john_user_identity_id",
      workspace_id: "seed_workspace_1",
      enrollment_automation_id: "john_assa_cs_enrollment_automation_id",
    })
  }

  db.addAcsSystem({
    acs_system_id: "visionline_acs_system_1",
    external_type: "visionline_system",
    name: "Fake Visionline System",
    workspace_id: "seed_workspace_1",
    connected_account_ids: ["john_connected_account_id"],
  })

  return {
    john_connected_account_id: "john_connected_account_id",
    jane_connected_account_id: "jane_connected_account_id",
    john_assa_cs_connected_account_id: "john_assa_cs_connected_account_id",
    seed_workspace_1: "seed_workspace_1",
    seed_workspace_2: "seed_workspace_2",
    august_device_1: "august_device_1",
    august_device_2: "august_device_2",
    ecobee_device_1: "ecobee_device_1",
    minut_device_1: "minut_device_1",
    schlage_device_1: "schlage_device_id",
    seam_apikey1_token: "seam_apikey1_token",
    seam_apikey2_token: "seam_apikey2_token",
    seam_cst1_token: "seam_cst1_token",
    seam_pk1_token: "seam_pk1_token",
    john_user_identifier_key: "john_user_identifier_key",
    john_user_identity_id: "john_user_identity_id",
    visionline_acs_system_1: "visionline_acs_system_1",
  }
}
