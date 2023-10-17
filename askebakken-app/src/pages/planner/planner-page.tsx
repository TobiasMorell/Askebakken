import { useRecoilValue } from "recoil";
import { useMemo } from "react";
import { selectedDaysWithParticipantsState, residentsState } from "./state";
import { useAutomaticWeekChange } from "./hooks";
import { PlannerPageTable } from "./layouts/table-planner";
import { CardBasedPlanner } from "./layouts/card-planner";
import { devicePreferences } from "../../app-state/device-preferences";

export default function PlannerPage() {
  useAutomaticWeekChange();
  const devicePrefs = useRecoilValue(devicePreferences);

  const menuPlans = useRecoilValue(selectedDaysWithParticipantsState);

  const residents = useRecoilValue(residentsState);
  const houses = useMemo(
    () => [...new Set(residents?.map((r) => r.houseNumber))].sort(),
    [residents]
  );
  const residentsByHouse = useMemo(() => {
    return residents?.groupBy((r) => r.houseNumber);
  }, [residents]);
  const residentById = useMemo(() => {
    return residents?.toDictionary((r) => r.id);
  }, [residents]);

  return devicePrefs.layout === "MODERN" ? (
    <CardBasedPlanner
      houses={houses}
      menuPlans={menuPlans}
      residentById={residentById}
      residentsByHouse={residentsByHouse}
    />
  ) : (
    <PlannerPageTable
      houses={houses}
      menuPlans={menuPlans}
      residentById={residentById}
      residentsByHouse={residentsByHouse}
    />
  );
}
