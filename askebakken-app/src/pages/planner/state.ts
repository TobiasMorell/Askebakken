import { atom, selector, useRecoilValue } from "recoil";
import { graphQLSelector, graphQLSelectorFamily } from "recoil-relay";
import { graphql } from "relay-runtime";
import { RelayEnvironment } from "../../RelayEnvironment";
import { getStartOfPlan, getEndOfPlan } from "./helpers";
import { stateResidentsQuery$data } from "../../__generated__/stateResidentsQuery.graphql";
import { stateMenuPlansQuery$data } from "../../__generated__/stateMenuPlansQuery.graphql";
import { stateUserAttendanceQuery$data } from "../../__generated__/stateUserAttendanceQuery.graphql";

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
            firstName
            lastName
            houseNumber
          }
        }
      }
    }
  `,
  variables: ({ get }) => ({
    startDate: get(startDateState).toDateOnlyISOString(),
    endDate: get(endDateState).toDateOnlyISOString(),
  }),
  mapResponse: (r: stateMenuPlansQuery$data) => {
    return r.menuPlan?.nodes?.map((n) => ({ ...n, date: new Date(n.date) }));
  },
});

export const selectedDaysWithParticipantsState = selector({
  key: "selectedDaysWithParticipants",
  get: ({ get }) => {
    const selectedDays = get(selectedDaysState);
    const participants = get(menuPlanParticipantsState);

    return selectedDays.map((d) => ({
      date: d,
      dateName: d.getDanishWeekday(),
      plan: participants?.find(
        (p) => p.date.getDayOfYear() === d.getDayOfYear()
      ),
    }));
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
