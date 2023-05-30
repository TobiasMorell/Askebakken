import { atom, selector, useRecoilValue } from "recoil";
import { graphQLSelector, graphQLSelectorFamily } from "recoil-relay";
import { graphql } from "relay-runtime";
import { RelayEnvironment } from "../../RelayEnvironment";
import { getStartOfPlan, getEndOfPlan } from "./helpers";
import { stateResidentsQuery$data } from "../../__generated__/stateResidentsQuery.graphql";
import { stateMenuPlansQuery$data } from "../../__generated__/stateMenuPlansQuery.graphql";
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
        id
        firstName
        lastName
        houseNumber
        child
      }
    }
  `,
  variables: {},
  mapResponse: (r: stateResidentsQuery$data) => r.residents,
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
        id
        firstName
        lastName
        houseNumber
        child
      }
    }
  `,
  variables: (houseNumber) => houseNumber,
  mapResponse: (r: stateResidentsQuery$data) => r.residents,
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
