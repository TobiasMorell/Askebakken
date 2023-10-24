import { useRecoilValue } from "recoil";
import { useMemo } from "react";
import {
  selectedDaysWithParticipantsState,
  allResidents,
  menuPlanUpdateSubscription,
} from "./menu-planner-state";
import { useAutomaticWeekChange } from "./hooks";
import { PlannerPageTable } from "./layouts/table-planner";
import { CardBasedPlanner } from "./layouts/card-planner";
import { devicePreferences } from "../../app-state/device-preferences";
import { useSubscription } from "react-relay";
import { GraphQLSubscriptionConfig } from "relay-runtime";
import { menuPlannerState_MenuPlanUpdatedSubscription } from "../../__generated__/menuPlannerState_MenuPlanUpdatedSubscription.graphql";
import { useToast } from "@chakra-ui/react";

export default function PlannerPage() {
  useAutomaticWeekChange();

  const toast = useToast();

  const devicePrefs = useRecoilValue(devicePreferences);

  const menuPlans = useRecoilValue(selectedDaysWithParticipantsState);

  const menuPlanUpdatedSubscriptionConfig: GraphQLSubscriptionConfig<menuPlannerState_MenuPlanUpdatedSubscription> =
    useMemo(
      () => ({
        subscription: menuPlanUpdateSubscription,
        variables: {},
        onCompleted: () => {
          toast({
            status: "success",
            description: "Du har forbindelse til serveren",
          });
        },
        onError: (error) => {
          toast({
            status: "error",
            description: "Du har mistet forbindelsen til serveren",
          });
        },
      }),
      [toast]
    );
  useSubscription<menuPlannerState_MenuPlanUpdatedSubscription>(
    menuPlanUpdatedSubscriptionConfig
  );

  const residents = useRecoilValue(allResidents);
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
