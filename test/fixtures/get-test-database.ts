import type { Fake as FakeDevicedb } from "@seamapi/fake-devicedb"
import { createDatabase, type Database } from "@seamapi/fake-seam-connect"
import type { ExecutionContext } from "ava"

export interface DatabaseFixture<TSeed = true> {
  db: Database
  seed: TSeed extends true ? Seed : never
}

interface Seed {
  ws1: {
    workspace_id: string
    publishable_key: string
  }
  ws2: {
    workspace_id: string
    publishable_key: string
    cst: string
    connected_account1_id: string
    device1_id: string
    device2_id: string
    noise_sensor_device_id: string
    noise_threshold_id: string
    acs_system1_id: string
    acs_user1_id: string
  }
}

export const getTestDatabase = async (
  _t: ExecutionContext,
  {
    seed: shouldSeed = true,
    fakeDevicedb,
  }: { seed?: boolean; fakeDevicedb?: FakeDevicedb } = {},
): Promise<DatabaseFixture> => {
  const db = createDatabase()

  if (fakeDevicedb?.serverUrl != null) {
    db.setDevicedbConfig({
      url: fakeDevicedb.serverUrl,
      vercelProtectionBypassSecret:
        fakeDevicedb.database.vercel_protection_bypass_secret,
    })
  }

  if (!shouldSeed) return { db, seed: {} as any } // NOTE: bad type, but not worth the templating

  const ws1 = db.addWorkspace({ name: "Seed Workspace 1 (starts empty)" })
  const ws2 = db.addWorkspace({
    name: "Seed Workspace 2 (starts populated)",
    is_sandbox: true,
  })

  const cw = db.addConnectWebview({
    workspace_id: ws2.workspace_id,
  })

  const ca = db.addConnectedAccount({
    provider: "august",
    workspace_id: ws2.workspace_id,
    user_identifier: {
      email: "john@example.com",
    },
  })

  db.updateConnectWebview({
    connect_webview_id: cw.connect_webview_id,
    connected_account_id: ca.connected_account_id,
    status: "authorized",
  })

  const device1 = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: "august_lock",
    name: "Front Door",
    workspace_id: ws2.workspace_id,
    properties: {
      name: "Fake Test August Lock",
      manufacturer: "august",
    },
  })

  const device2 = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: "august_lock",
    name: "Back Door",
    workspace_id: ws2.workspace_id,
  })

  const client_session = db.addClientSession({
    workspace_id: ws2.workspace_id,
    connect_webview_ids: [cw.connect_webview_id],
    connected_account_ids: [ca.connected_account_id],
    user_identifier_key: "seed_client_session_user",
  })

  const { device_id: noise_sensor_device_id } = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: "minut_sensor",
    name: "Living Room Noise Sensor",
    workspace_id: ws2.workspace_id,
  })
  const { noise_threshold_id } = db.addNoiseThreshold({
    device_id: noise_sensor_device_id,
    starts_daily_at: "07:00:00[America/Los_Angeles]",
    ends_daily_at: "12:00:00[America/Los_Angeles]",
  })

  const { acs_system_id } = db.addAcsSystem({
    external_type: "pti_site",
    name: "Fake Example Inc",
    workspace_id: ws2.workspace_id,
    connected_account_ids: [ca.connected_account_id],
  })

  const { acs_user_id } = db.addAcsUser({
    external_type: "pti_user",
    full_name: "Fake John Doe",
    workspace_id: ws2.workspace_id,
    acs_system_id,
  })

  const seed: Seed = {
    ws1: {
      workspace_id: ws1.workspace_id,
      publishable_key: ws1.publishable_key,
    },
    ws2: {
      workspace_id: ws2.workspace_id,
      publishable_key: ws2.publishable_key,
      cst: client_session.token,
      connected_account1_id: ca.connected_account_id,
      device1_id: device1.device_id,
      device2_id: device2.device_id,
      noise_sensor_device_id,
      noise_threshold_id,
      acs_system1_id: acs_system_id,
      acs_user1_id: acs_user_id,
    },
  }

  return { db, seed }
}
