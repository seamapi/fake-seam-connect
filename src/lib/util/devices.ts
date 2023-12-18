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
  device_filters: Omit<DeviceFilters, "is_managed">,
): Device[] => getDevicesWithFilter(db, { ...device_filters, is_managed: true })

export const getUnmanagedDevicesWithFilter = (
  db: ZustandDatabase,
  device_filters: Omit<DeviceFilters, "is_managed">,
): UnmanagedDevice[] =>
  getDevicesWithFilter(db, { ...device_filters, is_managed: false })

export const getDevicesWithFilter = (
  db: ZustandDatabase,
  device_filters: DeviceFilters,
): Device[] => {
  const {
    workspace_id,
    is_managed,
    manufacturer,
    name,
    device_id,
    device_ids,
    connected_account_id,
    connected_account_ids,
    device_type,
    device_types,
  } = device_filters

  return db.devices
    .filter((d) => d.workspace_id === workspace_id)
    .filter((d) => {
      if (is_managed == null) return true
      return d.is_managed === is_managed
    })
    .filter((d) => {
      if (manufacturer == null) return true
      return d.properties.manufacturer === manufacturer
    })
    .filter((d) => {
      if (name == null) return true
      return d.properties.name === name
    })
    .filter((d) => {
      if (device_id == null) return true
      return d.device_id === device_id
    })
    .filter((d) => {
      if (device_ids == null) return true
      return device_ids.includes(d.device_id)
    })
    .filter((d) => {
      if (connected_account_id == null) return true
      return d.connected_account_id === connected_account_id
    })
    .filter((d) => {
      if (connected_account_ids == null) return true
      return connected_account_ids.includes(d.connected_account_id)
    })
    .filter((d) => {
      if (device_type == null) return true
      return d.device_type === device_type
    })
    .filter((d) => {
      if (device_types == null) return true
      return device_types.includes(d.device_type)
    })
}
