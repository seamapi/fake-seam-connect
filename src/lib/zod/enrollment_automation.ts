import { z } from "zod"

export const enrollment_automation = z.object({
  enrollment_automation_id: z.string(),
  assa_abloy_credential_service_id: z.string(),
  user_identity_id: z.string(),
  workspace_id: z.string(),
})

export type EnrollmentAutomation = z.infer<typeof enrollment_automation>
