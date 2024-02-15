import type { AcsSystemExternalType } from "./zod/acs/system.ts"

export const SYSTEM_TYPE_TO_DISPLAY_NAME: Record<
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
