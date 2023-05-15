export function getWeekDates(weekNumber: number, year: number): Date[] {
  const firstDay = new Date(year, 0, 2 + (weekNumber - 1) * 7);
  // If firstDay is not a monday, go back to the previous monday
  if (firstDay.getDay() !== 1) {
    firstDay.setDate(firstDay.getDate() - firstDay.getDay() + 1);
  }

  return Array.enumerate({ to: 5 }).map(
    (i) => new Date(firstDay.getTime() + i * 24 * 60 * 60 * 1000)
  );
}
