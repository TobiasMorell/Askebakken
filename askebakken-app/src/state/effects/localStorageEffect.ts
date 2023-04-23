import { AtomEffect } from "recoil";

export function localStorageEffect(key: string): AtomEffect<string | null> {
  return ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(savedValue);
    }

    onSet((newValue, _, isReset) => {
      isReset || newValue == null
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, newValue);
    });
  };
}
