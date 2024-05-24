export function excludeFields<M, T extends keyof M>(
  model: M,
  fields: T[]
): Omit<M, T> {
  const result = {} as Omit<M, T>;
  Object.keys(model).forEach((key) => {
    if (!fields.includes(key as T)) {
      result[key as T] = model[key as T];
    }
  });
  return result;
}
