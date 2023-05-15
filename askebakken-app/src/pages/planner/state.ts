import { atom, selector, useRecoilValue } from "recoil";
import { graphQLSelector, graphQLSelectorFamily } from "recoil-relay";
import { graphql } from "relay-runtime";
import { RelayEnvironment } from "../../RelayEnvironment";
import { getStartOfPlan, getEndOfPlan } from "./helpers";
import { stateResidentsQuery$data } from "../../__generated__/stateResidentsQuery.graphql";
import { stateMenuPlansQuery$data } from "../../__generated__/stateMenuPlansQuery.graphql";
import { stateUserAttendanceQuery$data } from "../../__generated__/stateUserAttendanceQuery.graphql";
import { stateMenuPlanAttendanceChangedSubscription$data } from "../../__generated__/stateMenuPlanAttendanceChangedSubscription.graphql";
import { AttendanceEvent } from "./types";
import { appDisplayModeState } from "../../app-state/app-display-mode";
import {
  stateLoggedInUserHouseQuery$data,
  stateLoggedInUserHouseQuery$variables,
} from "../../__generated__/stateLoggedInUserHouseQuery.graphql";

export const startDateState = atom({
  key: "startDate",
  default: getStartOfPlan(),
});

export const endDateState = atom({
  key: "endDate",
  default: getEndOfPlan(),
});

export const selectedDaysState = selector<Date[]>({
  key: "selectedDays",
  get: ({ get }) => {
    const startDate = useRecoilValue(startDateState);
    const endDate = useRecoilValue(endDateState);

    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    return [...Array(diffDays + 1).keys()].map((i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  },
});

const allResidents = graphQLSelector({
  key: "residents",
  environment: RelayEnvironment,
  query: graphql`
    query stateResidentsQuery {
      residents {
        nodes {
          id
          firstName
          lastName
          houseNumber
          child
        }
      }
    }
  `,
  variables: {},
  mapResponse: (r: stateResidentsQuery$data) => r.residents?.nodes,
});

const loggedInUserHouse = graphQLSelector<
  stateLoggedInUserHouseQuery$variables,
  string
>({
  key: "loggedInUserHouse",
  environment: RelayEnvironment,
  query: graphql`
    query stateLoggedInUserHouseQuery {
      me {
        houseNumber
      }
    }
  `,
  variables: {},
  mapResponse: (r: stateLoggedInUserHouseQuery$data) => r.me.houseNumber,
});

const residentsInHouse = graphQLSelectorFamily({
  key: "residentsInHouse",
  environment: RelayEnvironment,
  query: graphql`
    query stateResidentsInHouseQuery($houseNumber: String) {
      residents(where: { houseNumber: { eq: $houseNumber } }) {
        nodes {
          id
          firstName
          lastName
          houseNumber
          child
        }
      }
    }
  `,
  variables: (houseNumber) => houseNumber,
  mapResponse: (r: stateResidentsQuery$data) => r.residents?.nodes,
});

export const residentsState = selector({
  key: "residentsState",
  get: ({ get }) => {
    const appDisplayMode = get(appDisplayModeState);
    if (appDisplayMode === "SYSTEM") {
      return get(allResidents);
    }

    const userHouse = get(loggedInUserHouse);
    return get(residentsInHouse({ houseNumber: userHouse }));
  },
});

export const menuPlanParticipantsState = graphQLSelectorFamily({
  key: "plannerPageState_menuPlanParticipants",
  environment: RelayEnvironment,
  query: graphql`
    query stateMenuPlansQuery($startDate: DateTime!, $endDate: DateTime!) {
      menuPlan(
        where: {
          and: [{ date: { gte: $startDate } }, { date: { lte: $endDate } }]
        }
      ) {
        nodes {
          id
          date
          recipes {
            id
            name
          }
          participants {
            id
          }
          guests {
            houseNumber
            numberOfAdultGuests
            numberOfChildGuests
          }
        }
      }
    }
  `,
  variables: (variables: { startDate: Date; endDate: Date }) => ({
    startDate: variables.startDate.toDateOnlyISOString(),
    endDate: variables.endDate.toDateOnlyISOString(),
  }),
  mapResponse: (r: stateMenuPlansQuery$data) => {
    return r.menuPlan?.nodes?.map((n) => ({ ...n, date: new Date(n.date) }));
  },
});

export const menuPlanAttendanceEvents = graphQLSelector({
  key: "menuPlanAttendanceEvents",
  environment: RelayEnvironment,
  query: graphql`
    subscription stateMenuPlanAttendanceChangedSubscription {
      menuPlanAttendanceChanged {
        menuPlanId
        residentId
        attending
      }
    }
  `,
  variables: () => ({}),
  mapResponse: (
    r: stateMenuPlanAttendanceChangedSubscription$data
  ): AttendanceEvent => r.menuPlanAttendanceChanged,
});

export const menuPlanAttendanceEventsState = atom<AttendanceEvent[]>({
  key: "menuPlanAttendanceEventsState",
  default: [],
});

export const selectedDaysWithParticipantsState = selector({
  key: "selectedDaysWithParticipants",
  get: ({ get }) => {
    const selectedDays = get(selectedDaysState);
    const menuPlans = get(
      menuPlanParticipantsState({
        startDate: selectedDays[0],
        endDate: selectedDays[selectedDays.length - 1],
      })
    );
    console.log(menuPlans);
    const attendanceEvents = get(menuPlanAttendanceEventsState);

    const attendanceByMenuPlanId = attendanceEvents.groupBy(
      (e) => e.menuPlanId
    );

    return selectedDays.map((d) => {
      const plan = menuPlans?.find(
        (p) => p.date.getDayOfYear() === d.getDayOfYear()
      );
      const attendanceEventsForPlan =
        attendanceByMenuPlanId.get(plan?.id) ?? [];

      const allParticipants = [
        ...new Set(
          attendanceEventsForPlan
            .map((e) => e.residentId)
            .concat(plan?.participants?.map((p) => p.id) ?? [])
        ),
      ];

      return {
        date: d,
        dateName: d.getDanishWeekday(),
        plan: plan
          ? {
              ...plan,
              participants: allParticipants
                .map((id) => {
                  const event = attendanceEventsForPlan.find(
                    (e) => e.residentId === id
                  );
                  if (event != null && !event.attending) {
                    return null;
                  }

                  return {
                    id,
                  };
                })
                .filter((p) => p != null),
            }
          : null,
      };
    });
  },
});

export const userAttendanceState = graphQLSelectorFamily({
  key: "userAttendance",
  environment: RelayEnvironment,
  query: graphql`
    query stateUserAttendanceQuery($userId: UUID!) {
      residents(where: { id: { eq: $userId } }) {
        nodes {
          id
          participatesInIds
        }
      }
    }
  `,
  variables: (userId: string) => ({ userId }),
  mapResponse: (r: stateUserAttendanceQuery$data) => r.residents?.nodes?.[0],
});
