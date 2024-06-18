import { BadRequestException, NotFoundException } from "nextlove"
import { z } from "zod"

import { withRouteSpec } from "lib/middleware/index.ts"
import { action_attempt } from "lib/zod/index.ts"

export default withRouteSpec({
  methods: ["POST"],
  auth: ["api_key", "console_session"],
  jsonResponse: z.object({
    action_attempt,
  }),
} as const)(async (req, res) => {
  const workspace = req.db.workspaces.find(
    (w) => w.workspace_id === req.auth.workspace_id,
  )

  if (workspace == null) {
    throw new NotFoundException({
      type: "workspace_not_found",
      message: "Workspace not found",
    })
  }

  if (!workspace.is_sandbox) {
    throw new BadRequestException(
      {
        type: "workspace_not_sandbox",
        message: "can only reset sandbox on sandbox workspaces",
      },
      { json: false },
    )
  }

  req.db.resetSandboxWorkspace(req.auth.workspace_id)

  const action_attempt = req.db.addActionAttempt({
    action_type: "RESET_SANDBOX_WORKSPACE",
  })
  req.db.updateActionAttempt({
    action_attempt_id: action_attempt.action_attempt_id,
    status: "success",
  })

  res.status(200).json({
    action_attempt,
  })
})
