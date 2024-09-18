import type {
  AcsAccessGroupExternalType,
  AcsSystemExternalType,
  AcsUserExternalType,
} from "./zod/index.ts"

export const ACS_SYSTEM_TYPE_TO_DISPLAY_NAME: Record<
  AcsSystemExternalType,
  string
> = {
  pti_site: "PTI site",
  alta_org: "Alta org",
  brivo_account: "Brivo account",
  salto_site: "Salto site",
  hid_credential_manager_organization: "HID org",
  visionline_system: "Visionline",
  assa_abloy_credential_service: "Assa Abloy Credential Service",
}

export const ACS_ACCESS_GROUP_EXTERNAL_TYPE_TO_DISPLAY_NAME: Record<
  AcsAccessGroupExternalType,
  string
> = {
  pti_unit: "PTI unit",
  pti_access_level: "PTI access level",
  salto_access_group: "Salto access group",
  brivo_group: "Brivo group",
}

export const USER_TYPE_TO_DISPLAY_NAME: Record<AcsUserExternalType, string> = {
  pti_user: "PTI user",
  brivo_user: "Brivo user",
  hid_credential_manager_user: "HID user",
  salto_site_user: "Salto site user",
}

export const SEAM_EVENT_LIST = [
  "device.connected",
  "device.unmanaged.connected",
  "device.disconnected",
  "device.unmanaged.disconnected",
  "device.converted_to_unmanaged",
  "device.unmanaged.converted_to_managed",
  "device.removed",
  "device.deleted",
  "device.tampered",
  "device.low_battery",
  "device.battery_status_changed",
  "device.third_party_integration_detected",
  "device.third_party_integration_no_longer_detected",
  "device.salto.privacy_mode_activated",
  "device.salto.privacy_mode_deactivated",
  "device.connection_became_flaky",
  "device.connection_stabilized",
  "device.error.subscription_required",
  "device.error.subscription_required.resolved",
  "access_code.created",
  "access_code.changed",
  "access_code.scheduled_on_device",
  "access_code.set_on_device",
  "access_code.deleted",
  "access_code.removed_from_device",
  "access_code.failed_to_set_on_device",
  "access_code.delay_in_setting_on_device",
  "access_code.failed_to_remove_from_device",
  "access_code.delay_in_removing_from_device",
  "access_code.deleted_external_to_seam",
  "access_code.modified_external_to_seam",
  "access_code.unmanaged.converted_to_managed",
  "access_code.unmanaged.failed_to_convert_to_managed",
  "access_code.unmanaged.created",
  "access_code.unmanaged.removed",
  "lock.locked",
  "lock.unlocked",
  "phone.deactivated",
  "connected_account.connected",
  "connected_account.successful_login",
  "connected_account.created",
  "connected_account.deleted",
  "connected_account.disconnected",
  "connected_account.completed_first_sync",
  "connected_account.completed_first_sync_after_reconnection",
  "noise_sensor.noise_threshold_triggered",
  "access_code.backup_access_code_pulled",
  "acs_user.deleted",
  "acs_credential.deleted",
  "enrollment_automation.deleted",
  "client_session.deleted",
]

export const EVENT_TO_DESCRIPTION_MAP: Record<string, string> = {
  "device.connected": "A new device has been connected to Seam",
  "access_code.created": "An access code has been created.",
  "access_code.deleted": "An access code has been deleted.",
  "lock.locked": "A lock device was locked.",
  "lock.unlocked": "A lock device was unlocked.",
}
