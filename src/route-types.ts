export type Routes = {
  '/health': {
    route: '/health'
    method: 'GET'
    queryParams: {}
    jsonBody: {}
    commonParams: {}
    formData: {}
    jsonResponse: {
      note: string
      ok: boolean
    }
  }
}

export type RouteResponse<Path extends keyof Routes> =
  Routes[Path]['jsonResponse']

export type RouteRequestBody<Path extends keyof Routes> =
  Routes[Path]['jsonBody'] & Routes[Path]['commonParams']

export type RouteRequestParams<Path extends keyof Routes> =
  Routes[Path]['queryParams'] & Routes[Path]['commonParams']
