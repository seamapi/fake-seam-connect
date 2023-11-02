// src/pages/api/types.ts
export interface RouteSpec {
  auth: string;
  methods: string[];
  jsonBody: any;
  jsonResponse: any;
}

// src/pages/api/index.tsx
import { RouteSpec } from './types';

export default withRouteSpec({
  auth: "none",
  methods: ["POST"],
  jsonBody: z.object({
    connect_webview_id: z.string(),
  }),
  jsonResponse: z.object({}),
})(async (req, res) => {
  // ... existing code ...
});
