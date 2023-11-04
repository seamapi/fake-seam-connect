import { createFake as createFakeDevicedb } from "@seamapi/fake-devicedb"
import { paramsSerializer } from "@seamapi/http/connect"
import type { ExecutionContext } from "ava"
import type { Axios } from "axios"
import type { NextApiRequest } from "next"
import type { TypedAxios } from "typed-axios-instance"

import type { Database, Routes } from "index.ts"

import nsm from "nsm/get-server-fixture.ts"
import type { NextApiHandler, NextApiResponse } from "nsm/types/nextjs.ts"

import { type DatabaseFixture, getTestDatabase } from "./get-test-database.ts"

export type { SimpleAxiosError } from "nsm/get-server-fixture.ts"

const { default: getServerFixture } = nsm

type ServerFixture<TSeed = true> = DatabaseFixture<TSeed> &
  Omit<Awaited<ReturnType<typeof getServerFixture>>, "axios"> & {
    axios: TypedAxios<Routes>
    get: Axios["get"]
  }

interface ApiRequest extends NextApiRequest {
  db?: Database | undefined
  baseUrl?: string | undefined
}

export const getTestServer = async <TSeed extends boolean>(
  t: ExecutionContext,
  { seed }: { seed?: TSeed } = {}
): Promise<ServerFixture<TSeed>> => {
  const fakeDevicedb = await createFakeDevicedb()
  await fakeDevicedb.seed()
  await fakeDevicedb.startServer()

  const { db, seed: seedResult } = await getTestDatabase(t, {
    seed: seed ?? true,
    fakeDevicedb,
  })

  let baseUrl: string | undefined
  baseUrl = undefined
  const fixture = await getServerFixture(t, {
    middlewares: [
      (next: NextApiHandler) => (req: ApiRequest, res: NextApiResponse) => {
        req.db = db
        req.baseUrl = baseUrl
        return next(req, res)
      },
    ],
  })
  baseUrl = fixture.serverURL

  fixture.axios.defaults.paramsSerializer = paramsSerializer

  return {
    ...fixture,
    get: fixture.axios.get.bind(fixture.axios),
    db,
    seed: seedResult as any,
  }
}
