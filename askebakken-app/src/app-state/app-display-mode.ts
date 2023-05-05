import { atom } from "recoil";
import { localStorageEffect } from "../state/effects/localStorageEffect";

export const appDisplayModeState = atom<"RESIDENT" | "SYSTEM">({
  key: "appDisplayMode",
  default: "RESIDENT",
  effects: [
    localStorageEffect("appDisplayMode", {
      stringify: (data) => data,
      parse: (data) => toAppDisplayMode(data),
    }),
  ],
});

export function toAppDisplayMode(mode: string | null) {
  const upperCased = mode?.toUpperCase();
  if (upperCased === "RESIDENT" || upperCased === "SYSTEM") {
    return upperCased;
  }
  return "RESIDENT";
}
