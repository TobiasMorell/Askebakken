import { Select } from "@chakra-ui/react";
import { graphQLSelector } from "recoil-relay";
import { graphql } from "relay-runtime";
import { RelayEnvironment } from "../RelayEnvironment";
import {
  residentSelectQuery$data,
  residentSelectQuery$variables,
} from "../__generated__/residentSelectQuery.graphql";
import { Resident } from "../pages/planner/types";
import { useRecoilValue } from "recoil";

const residentsQuery = graphql`
  query residentSelectQuery {
    residents (first: 50) {
      nodes {
        id
        firstName
        lastName
        houseNumber
      }
    }
  }
`;

const residentsState = graphQLSelector<
  residentSelectQuery$variables,
  readonly Omit<Resident, "child">[]
>({
  key: "residentSelectQuery",
  environment: RelayEnvironment,
  query: residentsQuery,
  variables: () => ({}),
  mapResponse: (data: residentSelectQuery$data) => {
    return data.residents?.nodes ?? [];
  },
});

export function ResidentSelect(props: {
  placeholder?: string;
  onChange: (residentId: string) => void;
}) {
  const residents = useRecoilValue(residentsState);

  return (
    <Select
      placeholder={props.placeholder}
      onChange={(evt) => props.onChange(evt.target.value)}
    >
      {residents.map((resident) => (
        <option key={resident.id} value={resident.id}>
          {resident.firstName} {resident.lastName}
        </option>
      ))}
    </Select>
  );
}
