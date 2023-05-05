import { AtomEffect } from "recoil";

export function localStorageEffect<TData>(
  key: string,
  mapping: {
    stringify: (data: TData) => string;
    parse: (data: string | null) => TData;
  }
): AtomEffect<TData> {
  return ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    const converted = mapping.parse(savedValue);
    if (savedValue != null) {
      setSelf(converted);
    }

    onSet((newValue, _, isReset) => {
      isReset || newValue == null
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, mapping.stringify(newValue));
    });
  };
}
