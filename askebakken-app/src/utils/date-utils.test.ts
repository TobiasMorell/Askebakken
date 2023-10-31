import { describe, test, expect } from "vitest";
import { getWeekDates } from "./date-utils";

import "../__prototype__/Array";
import "../__prototype__/Date";

describe("date-utils", () => {
  describe("getWeekDates", () => {
    test.each([
      [
        1,
        2023,
        [
          new Date(2023, 0, 2),
          new Date(2023, 0, 3),
          new Date(2023, 0, 4),
          new Date(2023, 0, 5),
          new Date(2023, 0, 6),
        ],
      ],
      [
        44,
        2023,
        [
          new Date(2023, 9, 30),
          new Date(2023, 9, 31),
          new Date(2023, 10, 1),
          new Date(2023, 10, 2),
          new Date(2023, 10, 3),
        ],
      ],
      [
        53,
        2020,
        [
          new Date(2020, 11, 28),
          new Date(2020, 11, 29),
          new Date(2020, 11, 30),
          new Date(2020, 11, 31),
          new Date(2021, 0, 1),
        ],
      ],
    ])(
      `should return the correct dates for week %s of %s`,
      (weekNumber, year, expected) => {
        // Act
        const result = getWeekDates(weekNumber, year);

        // Assert
        expect(result).toEqual(expected);
      }
    );
  });
});
