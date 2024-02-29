import { createFake as createFakeDevicedb } from "@seamapi/fake-devicedb"
import type { Database, Routes } from "@seamapi/fake-seam-connect"
import { serializeUrlSearchParams } from "@seamapi/url-search-params-serializer"
import type { ExecutionContext } from "ava"
import type { Axios } from "axios"
import type { NextApiRequest } from "next"
import type { TypedAxios } from "typed-axios-instance"

import getServerFixture from "nsm/get-server-fixture.ts"
import type { NextApiHandler, NextApiResponse } from "nsm/types/nextjs.ts"

import { type DatabaseFixture, getTestDatabase } from "./get-test-database.ts"

export type { SimpleAxiosError } from "nsm/get-server-fixture.ts"

type GetServerFixture = typeof getServerFixture.default

type ServerFixture<TSeed = true> = DatabaseFixture<TSeed> &
  Omit<Awaited<ReturnType<GetServerFixture>>, "axios"> & {
    axios: TypedAxios<Routes>
    get: Axios["get"]
  }

interface ApiRequest extends NextApiRequest {
  db?: Database | undefined
  baseUrl?: string | undefined
}

export const getTestServer = async <TSeed extends boolean>(
  t: ExecutionContext,
  { seed }: { seed?: TSeed } = {},
): Promise<ServerFixture<TSeed>> => {
  // Admin credentials to create testing access tokens
  process.env["ADMIN_USERNAME"] = "seamtest"
  process.env["ADMIN_PASSWORD"] = "seamtest"

  const fakeDevicedb = await createFakeDevicedb()
  await fakeDevicedb.seed()
  await fakeDevicedb.startServer()

  const { db, seed: seedResult } = await getTestDatabase(t, {
    seed: seed ?? true,
    fakeDevicedb,
  })

  let baseUrl: string | undefined
  baseUrl = undefined
  const fixture = await (getServerFixture as unknown as GetServerFixture)(t, {
    middlewares: [
      (next: NextApiHandler) => (req: ApiRequest, res: NextApiResponse) => {
        req.db = db
        req.baseUrl = baseUrl
        return next(req, res)
      },
    ],
  })
  baseUrl = fixture.serverURL

  fixture.axios.defaults.paramsSerializer = serializeUrlSearchParams

  return {
    ...fixture,
    // @ts-expect-error Current version of axios has upstream type issue.
    get: fixture.axios.get.bind(fixture.axios),
    db,
    seed: seedResult as any,
  }
}
