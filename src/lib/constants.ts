import type {
  AcsUserExternalType,
  AcsSystemExternalType,
  AcsAccessGroupExternalType,
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
