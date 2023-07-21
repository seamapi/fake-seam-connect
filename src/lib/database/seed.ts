import type { Database } from "./schema.ts"

export type Seed = {
  john_connected_account_id: "john_connected_account_id"
  jane_connected_account_id: "jane_connected_account_id"
  some_workspace_1: "some_workspace_1"
  some_workspace_2: "some_workspace_2"
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

  db.addWorkspace({ name: "My Workspace", workspace_id: "some_workspace_1" })
  db.addWorkspace({
    name: "Empty Workspace",
    workspace_id: "some_workspace_2",
  })

  const cw = db.addConnectWebview({
    workspace_id: "some_workspace_1",
  })

  db.addConnectedAccount({
    provider: "august",
    workspace_id: "some_workspace_1",
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
    workspace_id: "some_workspace_1",
  })

  db.addDevice({
    device_id: "august_device_2",
    connected_account_id: "john_connected_account_id",
    device_type: "august_lock",
    name: "Back Door",
    workspace_id: "some_workspace_1",
  })

  db.addConnectedAccount({
    provider: "schlage",
    workspace_id: "some_workspace_1",
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
    workspace_id: "some_workspace_1",
  })

  db.addClientSession({
    workspace_id: "some_workspace_1",
    connect_webview_ids: [cw.connect_webview_id],
    connected_account_ids: ["john_connected_account_id"],
    user_identifier_key: "seed_client_session_user",
  })

  return {
    john_connected_account_id: "john_connected_account_id",
    jane_connected_account_id: "jane_connected_account_id",
    some_workspace_1: "some_workspace_1",
    some_workspace_2: "some_workspace_2",
  }
}
