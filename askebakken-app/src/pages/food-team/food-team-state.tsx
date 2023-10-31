import { graphQLSelectorFamily } from "recoil-relay";
import { graphql } from "relay-runtime";
import { RelayEnvironment } from "../../RelayEnvironment";
import { foodTeamStateMenuPlansQuery$data } from "../../__generated__/foodTeamStateMenuPlansQuery.graphql";

export const menuPlanChefState = graphQLSelectorFamily({
  key: "foodTeamState_menuPlanParticipants",
  environment: RelayEnvironment,
  query: graphql`
    query foodTeamStateMenuPlansQuery(
      $startDate: DateTime
      $endDate: DateTime
    ) {
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
          chefs {
            id
            firstName
            lastName
            houseNumber
          }
        }
      }
    }
  `,
  variables: (params: { from: Date; to: Date }) => () => {
    const startDate = params.from.toDateOnlyISOString();
    const endDate = params.to.toDateOnlyISOString();
    return {
      startDate,
      endDate,
    };
  },
  mapResponse: (r: foodTeamStateMenuPlansQuery$data) => {
    return r.menuPlan?.nodes?.map((n) => ({ ...n, date: new Date(n.date) }));
  },
});
