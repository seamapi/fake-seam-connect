import type { Server as HttpServer } from "node:http"
import { setImmediate } from "node:timers/promises"

import { createTerminus } from "@godaddy/terminus"
import getPort from "get-port"
import type { NextApiRequest } from "next"

import { createDatabase, type Database } from "lib/database/index.ts"
import * as nsm from "nsm/index.ts"

import logger from "lib/logger.ts"

const { runServer } = nsm

interface ServerOptions {
  port: number
  server: HttpServer
}

interface ApiRequest extends NextApiRequest {
  db?: Database | undefined
}

export async function startServer(
  options: {
    port?: number | undefined
    database?: Database
    signals?: string[]
  } = {}
): Promise<Server> {
  const database = options.database ?? createDatabase()
  const port = options.port ?? (await getPort())
  const signals = options.signals ?? []

  logger.debug(`Starting fake on http://localhost:${port}`)

  const server = await runServer({
    port,
    middlewares: [
      (next) => (req: ApiRequest, res) => {
        req.db = database
        return next(req, res)
      },
    ],
  })

  return new Server({
    server: createTerminus(server, {
      onShutdown: async () => {
        logger.info("Shutdown")
        await setImmediate()
      },
      logger: (msg, err) => {
        logger.error(msg, err)
      },
      signals,
    }),
    port,
  })
}

export class Server {
  public port: number
  public server: HttpServer

  constructor({ port, server }: ServerOptions) {
    this.port = port
    this.server = server
  }

  get serverUrl(): string {
    return `http://localhost:${this.port}`
  }

  close(): void {
    this.server.close()
  }
}

export default startServer
