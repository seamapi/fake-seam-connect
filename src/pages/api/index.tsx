// src/pages/api/types.ts
// src/pages/api/index.tsx
import { RouteSpec } from "./types"

export interface RouteSpec {
  auth: string
  methods: string[]
  jsonBody: any
  jsonResponse: any
}

// Removed withRouteSpec function
export default async (req, res) => {
  // ... existing code ...
}
