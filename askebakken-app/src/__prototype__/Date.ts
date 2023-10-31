declare global {
  interface Date {
    getWeek(): number;
    getDayOfYear(): number;
    toDateOnlyISOString(): string;
    getDanishWeekday(): string;
    addDays(days: number): Date;
  }
}

Date.prototype.addDays = function (days: number): Date {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
  const date = new Date(this.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
};

Date.prototype.getDayOfYear = function () {
  const start = new Date(this.getFullYear(), 0, 0);
  const diff =
    this.getTime() -
    start.getTime() +
    (start.getTimezoneOffset() - this.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

Date.prototype.toDateOnlyISOString = function () {
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(this);
  let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(this);
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(this);
  return `${ye}-${mo}-${da}` + "Z";
};

const weekdays = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
];
Date.prototype.getDanishWeekday = function () {
  return weekdays[this.getDay()];
};

export {};
