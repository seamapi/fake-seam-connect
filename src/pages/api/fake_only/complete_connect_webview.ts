import { withRouteSpec } from "lib/middleware/with-route-spec.ts"
import { connect_webview } from "lib/zod/index.ts"
import { BadRequestException, NotFoundException } from "nextlove"
import { z } from "zod"

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  jsonBody: z.object({
    connect_webview_id: z.string(),
  }),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const connect_webview = req.db.connect_webviews.find(
    (cw) => cw.connect_webview_id === req.body.connect_webview_id
  )

  if (!connect_webview) {
    throw new NotFoundException({
      type: "connect_webview_not_found",
      message: "Connect webview not found",
    })
  }

  const connected_account = req.db.addConnectedAccount({
    provider: "august",
  })
  const device1 = req.db.addDevice({
    device_type: "august_lock",
  })

  req.db.updateConnectWebview({
    connect_webview_id: connect_webview.connect_webview_id,
    status: "complete",
  })

  // const connect_webview = req.db.addConnectWebview({
  //   workspace_id: req.auth.workspace_id,
  // })
  // res.status(200).json({ connect_webview })
})
