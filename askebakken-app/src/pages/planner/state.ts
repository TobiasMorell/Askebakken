import { atom, atomFamily, noWait, selector, useRecoilValue } from "recoil";
import { graphQLSelector, graphQLSelectorFamily } from "recoil-relay";
import { graphql } from "relay-runtime";
import { RelayEnvironment } from "../../RelayEnvironment";
import { getStartOfPlan, getEndOfPlan } from "./helpers";
import { stateResidentsQuery$data } from "../../__generated__/stateResidentsQuery.graphql";
import { stateMenuPlansQuery$data } from "../../__generated__/stateMenuPlansQuery.graphql";
import { stateUserAttendanceQuery$data } from "../../__generated__/stateUserAttendanceQuery.graphql";
import { stateMenuPlanAttendanceChangedSubscription$data } from "../../__generated__/stateMenuPlanAttendanceChangedSubscription.graphql";
import { groupBy } from "../../utils/array-utils";
import { AttendanceEvent } from "./types";

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

export const residentsState = graphQLSelector({
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
        }
      }
    }
  `,
  variables: {},
  mapResponse: (r: stateResidentsQuery$data) => r.residents?.nodes,
});

export const menuPlanParticipantsState = graphQLSelector({
  key: "menuPlanParticipants",
  environment: RelayEnvironment,
  query: graphql`
    query stateMenuPlansQuery($startDate: DateTime, $endDate: DateTime) {
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
        }
      }
    }
  `,
  variables: ({ get }) => {
    const startDate = get(startDateState).toDateOnlyISOString();
    const endDate = get(endDateState).toDateOnlyISOString();
    return {
      startDate,
      endDate,
    };
  },
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
    const menuPlans = get(menuPlanParticipantsState);
    const attendanceEvents = get(menuPlanAttendanceEventsState);

    const attendanceByMenuPlanId = groupBy(
      attendanceEvents,
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
