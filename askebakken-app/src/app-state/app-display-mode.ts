import { atom } from "recoil";
import { localStorageEffect } from "../state/effects/localStorageEffect";

export const appDisplayModeState = atom<"RESIDENT" | "SYSTEM">({
  key: "appDisplayMode",
  default: getModeFromUrl(),
  effects: [
    localStorageEffect("appDisplayMode", {
      stringify: (data) => data,
      parse: (data) => toAppDisplayMode(data),
    }),
  ],
});

function getModeFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");
  return toAppDisplayMode(mode);
}

function toAppDisplayMode(mode: string | null) {
  const upperCased = mode?.toUpperCase();
  if (upperCased === "RESIDENT" || upperCased === "SYSTEM") {
    return upperCased;
  }
  return "RESIDENT";
}
