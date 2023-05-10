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

export function enumerate(options: {
  from?: number;
  to: number;
  step?: number;
}) {
  const { from = 0, to, step = 1 } = options;
  return Array.from(
    { length: Math.floor((to - 1 - from) / step) + 1 },
    (_, i) => from + i * step
  );
}

export function sumBy<T>(array: readonly T[], selector: (item: T) => number) {
  return array.reduce((sum, item) => sum + selector(item), 0);
}
