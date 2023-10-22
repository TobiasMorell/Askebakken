import { useInterval } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { getStartOfPlan, getEndOfPlan } from "./helpers";
import { startDateState, endDateState } from "./menu-planner-state";

export function useAutomaticWeekChange() {
  const setStartDate = useSetRecoilState(startDateState);
  const setEndDate = useSetRecoilState(endDateState);

  const everyHour = 1000 * 60 * 60;

  useInterval(() => {
    const now = new Date();
    // Saturday morning after 6:00
    if (now.getDay() === 6 && now.getHours() >= 6 && now.getHours() < 7) {
      const weekStart = getStartOfPlan();
      const endDate = getEndOfPlan();

      setStartDate(weekStart);
      setEndDate(endDate);
    }
  }, everyHour);
}
