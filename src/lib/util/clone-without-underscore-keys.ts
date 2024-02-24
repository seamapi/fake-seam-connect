export const cloneWithoutUnderscoreKeys = <T extends Record<any, any>>(
  obj: T,
  // TODO: define proper return type
): any =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !key.startsWith("_")),
  )
