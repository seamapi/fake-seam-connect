type WithoutUnderscoreKeys<T> = {
  [K in keyof T as K extends `_${string}` ? never : K]: T[K]
}

export const cloneWithoutUnderscoreKeys = <T extends object>(
  obj: T,
): WithoutUnderscoreKeys<T> =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) => !key.startsWith("_")),
  ) as WithoutUnderscoreKeys<T>
