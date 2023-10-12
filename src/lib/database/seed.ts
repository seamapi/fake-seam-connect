import type { Database } from "./schema.ts"

export interface Seed {
  john_connected_account_id: "john_connected_account_id"
  jane_connected_account_id: "jane_connected_account_id"
  seed_workspace_1: "seed_workspace_1"
  seed_workspace_2: "seed_workspace_2"
  august_device_1: "august_device_1"
  august_device_2: "august_device_2"
  ecobee_device_1: "ecobee_device_1"
  schlage_device_1: "schlage_device_id"
  seam_apikey1_token: "seam_apikey1_token"
  seam_apikey2_token: "seam_apikey2_token"
  seam_cst1_token: "seam_cst1_token"
  seam_pk1_token: "seam_pk1_token"
  john_user_identifier_key: "john_user_identifier_key"
}

export const seed = (db: Database): Seed => {
  if (
    db.connected_accounts.some(
      (ca) => ca.user_identifier?.email === "john@example.com"
    )
  ) {
    throw new Error(
      "Database has already been seeded (already has john@example.com)"
    )
  }

  db.addWorkspace({
    name: "My Workspace",
    workspace_id: "seed_workspace_1",
    publishable_key: "seam_pk1_token",
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
    name: "Front Door",
    workspace_id: "seed_workspace_1",
    properties: {
      name: "Fake August Lock 1",
      manufacturer: "august",
    }
  })

  db.addDevice({
    device_id: "august_device_2",
    connected_account_id: "john_connected_account_id",
    device_type: "august_lock",
    name: "Back Door",
    workspace_id: "seed_workspace_1",
  })

  db.addDevice({
    device_id: "ecobee_device_1",
    connected_account_id: "john_connected_account_id",
    device_type: "ecobee_thermostat",
    name: "Thermostat 1",
    workspace_id: "seed_workspace_1",
    properties: {
      is_cooling_available: true,
      is_heating_available: true,
    },
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
    name: "Bathroom Door",
    workspace_id: "seed_workspace_1",
  })

  db.addClientSession({
    workspace_id: "seed_workspace_1",
    connect_webview_ids: [cw.connect_webview_id],
    connected_account_ids: ["john_connected_account_id"],
    user_identifier_key: "john_user_identifier_key",
    token: "seam_cst1_token",
  })

  return {
    john_connected_account_id: "john_connected_account_id",
    jane_connected_account_id: "jane_connected_account_id",
    seed_workspace_1: "seed_workspace_1",
    seed_workspace_2: "seed_workspace_2",
    august_device_1: "august_device_1",
    august_device_2: "august_device_2",
    ecobee_device_1: "ecobee_device_1",
    schlage_device_1: "schlage_device_id",
    seam_apikey1_token: "seam_apikey1_token",
    seam_apikey2_token: "seam_apikey2_token",
    seam_cst1_token: "seam_cst1_token",
    seam_pk1_token: "seam_pk1_token",
    john_user_identifier_key: "john_user_identifier_key",
  }
}
