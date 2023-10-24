import type { ZustandDatabase } from "lib/database/schema.ts"
import type { Device, UnmanagedDevice } from "lib/zod/device.ts"

interface DeviceFilters {
  device_id?: string
  device_ids?: string[]
  connected_account_id?: string
  connected_account_ids?: string[]
  device_type?: string
  device_types?: string[]
  manufacturer?: string
  name?: string
  is_managed?: boolean
  workspace_id: string
}

export const getManagedDevicesWithFilter = (
  db: ZustandDatabase,
  device_filters: Omit<DeviceFilters, "is_managed">
): Device[] => getDevicesWithFilter(db, { ...device_filters, is_managed: true })

export const getUnmanagedDevicesWithFilter = (
  db: ZustandDatabase,
  device_filters: Omit<DeviceFilters, "is_managed">
): UnmanagedDevice[] =>
  getDevicesWithFilter(db, { ...device_filters, is_managed: false })

export const getDevicesWithFilter = (
  db: ZustandDatabase,
  device_filters: DeviceFilters
): Device[] => {
  const {
    is_managed,
    workspace_id,
    manufacturer,
    name,
    device_id,
    connected_account_id,
    device_type,
  } = device_filters

  const device_types =
    device_type != null
      ? [device_type, ...(device_filters.device_types ?? [])]
      : device_filters.device_types ?? []
  const connected_account_ids =
    connected_account_id != null
      ? [connected_account_id, ...(device_filters.connected_account_ids ?? [])]
      : device_filters.connected_account_ids ?? []
  const device_ids =
    device_id != null
      ? [device_id, ...(device_filters.device_ids ?? [])]
      : device_filters.device_ids ?? []

  return db.devices.filter(
    (d) =>
      d.workspace_id === workspace_id &&
      (is_managed == null ? true : d.is_managed === is_managed) &&
      (device_ids.length === 0 ? true : device_ids.includes(d.device_id)) &&
      (connected_account_ids.length === 0
        ? true
        : connected_account_ids.includes(d.connected_account_id)) &&
      (device_types.length === 0
        ? true
        : device_types.includes(d.device_type)) &&
      (manufacturer == null
        ? true
        : "manufacturer" in d.properties
        ? d.properties.manufacturer === manufacturer
        : false) &&
      (name == null ? true : d.properties.name === name)
  )
}
