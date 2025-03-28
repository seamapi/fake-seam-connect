import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"

import {
  bridge_connected_system,
  type BridgeConnectedSystem,
} from "lib/zod/bridge_connected_system.ts"

export default withRouteSpec({
  description: `
  ---
  title: List Bridge Connected Systems
  response_key: bridge_connected_systems
  undocumented: Seam Bridge Client only.
  ---
  Returns the bridge connected systems associated with the session token used.
  `,
  auth: ["bridge_client_session"],
  methods: ["GET", "POST"],
  jsonResponse: z.object({
    bridge_connected_systems: z.array(bridge_connected_system),
  }),
} as const)(async (req, res) => {
  const { db, auth } = req

  const bridges = db.bridges.filter(
    (bridge) =>
      bridge.bridge_client_session_id ===
      auth.bridge_client_session.bridge_client_session_id,
  )

  const bridge_connected_systems: BridgeConnectedSystem[] = bridges.map(
    (bridge) => {
      const connected_account = db.connected_accounts.find(
        (connected_account) => connected_account.bridge_id === bridge.bridge_id,
      )

      if (connected_account == null) {
        throw new Error("Could not find connected_account for bridge.")
      }

      const acs_system = db.acs_systems.find(
        (acs_system) =>
          acs_system.third_party_account_id ===
          connected_account.connected_account_id,
      )

      if (acs_system == null) {
        throw new Error("Could not find acs_system for third_party_account.")
      }

      const workspace = db.workspaces.find(
        (workspace) => workspace.workspace_id === bridge.workspace_id,
      )

      if (workspace == null) {
        throw new Error("Could not find workspace for bridge.")
      }

      return {
        bridge_id: bridge.bridge_id,
        bridge_created_at: bridge.created_at,
        connected_account_id: connected_account.connected_account_id,
        connected_account_created_at: connected_account.created_at,
        acs_system_id: acs_system.acs_system_id,
        acs_system_display_name: acs_system.name,
        workspace_id: bridge.workspace_id,
        workspace_display_name: workspace.name,
      }
    },
  )

  res.status(200).json({
    bridge_connected_systems,
  })
})
