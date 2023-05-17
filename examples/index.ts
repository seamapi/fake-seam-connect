#!/usr/bin/env tsx

import landlubber from "landlubber"

import * as databaseSample from "./database-sample.ts"

const commands = [databaseSample]

await landlubber(commands).parse()
