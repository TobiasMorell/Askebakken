import { atom } from "recoil";
import { localStorageEffect } from "../state/effects/localStorageEffect";

export type DevicePreferences = {
  appDisplayMode: "RESIDENT" | "SYSTEM";
  layout: "MODERN" | "CLASSIC";
};

export const devicePreferences = atom<DevicePreferences>({
  key: "devicesPreferences",
  default: {
    appDisplayMode: "RESIDENT",
    layout: "MODERN",
  },
  effects: [
    localStorageEffect("devicePreferences", {
      stringify: (data) => JSON.stringify(data),
      parse: (data) => {
        try {
          const prefs = JSON.parse(data ?? "{}");
          return {
            appDisplayMode: toAppDisplayMode(prefs.appDisplayMode),
            layout: prefs.layout,
          };
        } catch {
          return {
            appDisplayMode: toAppDisplayMode(data),
            layout: "CLASSIC",
          };
        }
      },
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
