import { graphql, useMutation } from "react-relay";
import { weekPlanGuestsUpsertGuestsMutation } from "../../../__generated__/weekPlanGuestsUpsertGuestsMutation.graphql";
import { useEffect, useState } from "react";
import { Button, Center, Input, Spinner, useToast } from "@chakra-ui/react";

const setGuests = graphql`
  mutation weekPlanGuestsUpsertGuestsMutation(
    $houseNumber: String!
    $menuPlanId: UUID!
    $adults: Int
    $children: Int
  ) {
    upsertGuests(
      houseNumber: $houseNumber
      menuPlanId: $menuPlanId
      numberOfAdultGuests: $adults
      numberOfChildGuests: $children
    ) {
      guests {
        houseNumber
        numberOfAdultGuests
        numberOfChildGuests
      }
    }
  }
`;

type WeekPlanGuestsProps = {
  defaultValue: number;
  houseNumber: string;
  menuPlanId: string;
  for: "ADULTS" | "CHILDREN";
};

export function WeekPlanGuests(props: WeekPlanGuestsProps) {
  const toast = useToast();
  const [commit, loading] =
    useMutation<weekPlanGuestsUpsertGuestsMutation>(setGuests);

  const [numberOfGuests, setNumberOfGuests] = useState<number>(
    props.defaultValue
  );
  const isNumberOfGuestsValid =
    numberOfGuests != null &&
    numberOfGuests > 0 &&
    !Number.isNaN(numberOfGuests);

  useEffect(
    () => {
      if (
        !isNumberOfGuestsValid ||
        loading ||
        numberOfGuests === props.defaultValue
      ) {
        return;
      }

      function upsertGuests() {
        toast.closeAll();
        commit({
          variables: {
            houseNumber: props.houseNumber,
            menuPlanId: props.menuPlanId,
            adults: props.for === "ADULTS" ? numberOfGuests : undefined,
            children: props.for === "CHILDREN" ? numberOfGuests : undefined,
          },
          onCompleted: () => {
            toast({
              title: "Gæster tilføjet",
              status: "success",
              description: `Du tilføjede ${numberOfGuests} ${
                props.for === "ADULTS" ? "voksne" : "børn"
              }`,
            });
          },
          onError: (err) => {
            toast({
              title: "Gæsterne kunne ikke tilføjes",
              status: "error",
              description: (
                <Button
                  onClick={() => upsertGuests()}
                  variant="outline"
                  size="sm"
                >
                  Prøv igen
                </Button>
              ),
              duration: null,
              isClosable: true,
            });
          },
        });
      }
      const timeout = setTimeout(upsertGuests, 1500);
      return () => clearTimeout(timeout);
    },
    // only run when numberOfGuests changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [numberOfGuests, isNumberOfGuestsValid]
  );

  return loading ? (
    <Center>
      <Spinner />
    </Center>
  ) : (
    <Input
      type="number"
      placeholder="Antal"
      value={Number.isNaN(numberOfGuests) ? "" : numberOfGuests}
      onChange={(evt) => {
        if (evt.target.value) {
          setNumberOfGuests(Number.parseInt(evt.target.value));
        } else {
          setNumberOfGuests(Number.NaN);
        }
      }}
    />
  );
}
