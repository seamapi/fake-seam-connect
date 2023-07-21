import { z } from "zod"

import { withRouteSpec } from "lib/middleware/with-route-spec.ts"

export default withRouteSpec({
  auth: "none",
  methods: ["GET", "POST"],
  queryParams: z.any(),
  jsonBody: z.any().optional(),
  jsonResponse: z.object({}),
} as const)(async (req, res) => {
  const func = (req.db as any)[req.query.func ]
  if (!func || typeof func !== "function") {
    const available_functions = Object.keys(req.db).filter(
      (key) => typeof (req.db as any)[key] === "function"
    )
    res.status(404).json({
      error: {
        error_code: "rpc_function_not_found",
        message: `Function "${req.query.func}" not found, did you define a function on your database? Available functions: ${available_functions}`,
      },
    })
    return
  }

  if (req.method === "GET") {
    const params = { ...req.query }
    delete params.func
    res.status(200).json(func(params))
  } else {
    res.status(200).json(func(req.body))
  }
})
