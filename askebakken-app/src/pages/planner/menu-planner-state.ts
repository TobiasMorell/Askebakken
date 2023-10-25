import { atom, selector, useRecoilValue } from "recoil";
import { graphQLSelector, graphQLSelectorFamily } from "recoil-relay";
import { graphql } from "relay-runtime";
import { RelayEnvironment } from "../../RelayEnvironment";
import { getStartOfPlan, getEndOfPlan } from "./helpers";
import { menuPlannerState_ResidentsQuery$data } from "../../__generated__/menuPlannerState_ResidentsQuery.graphql";
import {
  menuPlannerState_LoggedInUserHouseQuery$data,
  menuPlannerState_LoggedInUserHouseQuery$variables,
} from "../../__generated__/menuPlannerState_LoggedInUserHouseQuery.graphql";
import { menuPlannerState_MenuPlansQuery$data } from "../../__generated__/menuPlannerState_MenuPlansQuery.graphql";

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

export const allResidents = graphQLSelector({
  key: "residents",
  environment: RelayEnvironment,
  query: graphql`
    query menuPlannerState_ResidentsQuery {
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
  mapResponse: (r: menuPlannerState_ResidentsQuery$data) => r.residents?.nodes,
});

export const loggedInUserHouse = graphQLSelector<
  menuPlannerState_LoggedInUserHouseQuery$variables,
  string
>({
  key: "loggedInUserHouse",
  environment: RelayEnvironment,
  query: graphql`
    query menuPlannerState_LoggedInUserHouseQuery {
      me {
        id
        houseNumber
      }
    }
  `,
  variables: {},
  mapResponse: (r: menuPlannerState_LoggedInUserHouseQuery$data) =>
    r.me.houseNumber,
});

export const menuPlanParticipantsState = graphQLSelectorFamily({
  key: "plannerPageState_menuPlanParticipants",
  environment: RelayEnvironment,
  query: graphql`
    query menuPlannerState_MenuPlansQuery(
      $startDate: DateTime!
      $endDate: DateTime!
    ) {
      menuPlan(
        where: {
          and: [{ date: { gte: $startDate } }, { date: { lte: $endDate } }]
        }
      ) {
        nodes {
          id
          date
          thumbnail
          recipes {
            id
            name
          }
          participants {
            id
          }
          chefs {
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
  mapResponse: (r: menuPlannerState_MenuPlansQuery$data) => {
    return r.menuPlan?.nodes?.map((n) => ({ ...n, date: new Date(n.date) }));
  },
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

    return menuPlans ?? [];
  },
});

export const menuPlanUpdateSubscription = graphql`
  subscription menuPlannerState_MenuPlanUpdatedSubscription {
    menuPlanUpdated {
      updatedMenuPlan {
        id
        participants {
          id
          firstName
          lastName
        }
        chefs {
          id
          firstName
          lastName
        }
        guests {
          houseNumber
          numberOfAdultGuests
          numberOfChildGuests
        }
      }
    }
  }
`;
