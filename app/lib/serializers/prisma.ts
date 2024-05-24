export function excludeFields<M, T extends keyof M>(
  model: M,
  fields: T[] | string[]
): Omit<M, T> {
  return Object.fromEntries(
    Object.entries(model as ArrayLike<M>).filter(
      ([key]) => !fields.includes(key as any)
    )
  ) as Omit<M, T>;
}
