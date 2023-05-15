declare global {
  interface Array<T> {
    groupBy<TKey>(keyGetter: (item: T) => TKey): Map<TKey, T[]>;
    toDictionary<TKey extends { toString(): string }>(
      keyGetter: (item: T) => TKey
    ): Map<TKey, T>;
    sumBy(selector: (item: T) => number): number;
  }

  interface ReadonlyArray<T> {
    groupBy<TKey>(keyGetter: (item: T) => TKey): Map<TKey, T[]>;
    toDictionary<TKey extends { toString(): string }>(
      keyGetter: (item: T) => TKey
    ): Map<TKey, T>;
    sumBy(selector: (item: T) => number): number;
  }

  interface ArrayConstructor {
    enumerate(options: { from?: number; to: number; step?: number }): number[];
  }
}

Array.prototype.groupBy = function <TKey, T>(keyGetter: (item: T) => TKey) {
  const map = new Map<TKey, T[]>();
  this.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

Array.prototype.toDictionary = function <
  TKey extends { toString(): string },
  T
>(keyGetter: (item: T) => TKey) {
  const map = new Map<TKey, T>();
  this.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, item);
    } else {
      throw new Error("Duplicate key: " + key.toString());
    }
  });
  return map;
};

Array.enumerate = function (options: {
  from?: number;
  to: number;
  step?: number;
}) {
  const { from = 0, to, step = 1 } = options;
  return Array.from(
    { length: Math.floor((to - 1 - from) / step) + 1 },
    (_, i) => from + i * step
  );
};

Array.prototype.sumBy = function <T>(selector: (item: T) => number) {
  return this.reduce((sum, item) => sum + selector(item), 0);
};

export {};
