export function getStartOfPlan() {
  const now = new Date();
  if (now.getDay() > 5) {
    // Skip to next monday
    now.setDate(now.getDate() + (8 - now.getDay()));
  } else {
    // Skip to previous monday
    now.setDate(now.getDate() - (now.getDay() - 1));
  }

  return now;
}

export function getEndOfPlan() {
  const start = getStartOfPlan();
  start.setDate(start.getDate() + 4);
  return start;
}

export function getPlanForWeek(weekNumber: number, year: number) {
  const d = new Date(year, 0, 1);
  const dayNum = d.getDay();
  let diff = --weekNumber * 7;

  // If 1 Jan is Friday to Sunday, go to next week
  if (!dayNum || dayNum > 4) {
    diff += 7;
  }

  // Add required number of days
  d.setDate(d.getDate() - d.getDay() + ++diff);

  const end = new Date(d.getTime());
  end.setDate(end.getDate() + 4);
  return {
    start: d,
    end,
  };
}
