import { graphql } from "react-relay";
import { graphQLSelector } from "recoil-relay";
import { RelayEnvironment } from "../RelayEnvironment";
import { loggedInUser_MeQuery$data } from "../__generated__/loggedInUser_MeQuery.graphql";

export const loggedInUser = graphQLSelector({
  query: graphql`
    query loggedInUser_MeQuery {
      me {
        id
        firstName
        lastName
      }
    }
  `,
  environment: RelayEnvironment,
  key: "me",
  variables: {},
  mapResponse: (r: loggedInUser_MeQuery$data) => r.me,
});
