export function groupBy<TKey, T>(
  array: readonly T[],
  keyGetter: (item: T) => TKey
) {
  const map = new Map<TKey, T[]>();
  array.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function toDictionary<TKey extends { toString(): string }, T>(
  array: readonly T[],
  keyGetter: (item: T) => TKey
) {
  const map = new Map<TKey, T>();
  array.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, item);
    } else {
      throw new Error("Duplicate key: " + key.toString());
    }
  });
  return map;
}
