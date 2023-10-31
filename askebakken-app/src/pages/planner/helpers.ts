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
  return start.addDays(4);
}

