import { describe, test, expect } from "vitest";

import "./Date";

describe("Date", () => {
  describe("addDays", () => {
    test.each([
      [new Date(2021, 0, 1), 1, new Date(2021, 0, 2)],
      [new Date(2023, 11, 31), 1, new Date(2024, 0, 1)],
      [new Date(2022, 0, 1), 365, new Date(2023, 0, 1)],
      [new Date(2024, 0, 1), -1, new Date(2023, 11, 31)],
    ])("%s.addDays(%d) -> %s", (date, days, expected) => {
      // Act
      const result = date.addDays(days);

      // Assert
      expect(result).toEqual(expected);
    });
  });
});
