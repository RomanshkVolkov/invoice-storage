function tryParseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value; // Devuelve el valor original si no se puede parsear.
  }
}

function recursiveParse<T = any[] | any>(item: T): T {
  if (Array.isArray(item)) {
    return item.map(recursiveParse) as T; // Procesa cada elemento del array.
  } else if (typeof item === 'object' && item !== null) {
    return Object.keys(item).reduce((acc, key) => {
      const typedKey = key as keyof typeof item;
      acc[key] = recursiveParse(item[typedKey]); // Procesa cada valor del objeto.

      return acc;
    }, {} as any) as T;
  } else if (typeof item === 'string') {
    const parsedItem = tryParseJson(item);

    if (parsedItem !== item) {
      return recursiveParse(parsedItem); // Procesa el elemento parseado si era una cadena JSON.
    }
  }
  return item as T; // Devuelve el elemento si no es ni un array ni un objeto.
}

export function serializedDB<T>(data: T[]) {
  return data.map(recursiveParse);
}
