import { graphql, useMutation } from "react-relay";
import { weekPlanGuestsUpsertGuestsMutation } from "../../../__generated__/weekPlanGuestsUpsertGuestsMutation.graphql";
import { useMemo, useState } from "react";
import { Text, Button, Input, Select, Stack, useToast } from "@chakra-ui/react";

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

export function AddGuestsForm(props: {
  onFieldTouched: () => void;
  houses: string[];
  menuPlanId: string;
}) {
  const toast = useToast();
  const [commit, loading] =
    useMutation<weekPlanGuestsUpsertGuestsMutation>(setGuests);

  const [adults, setAdults] = useState<string>();
  const [children, setChildren] = useState<string>();
  const [house, setHouse] = useState<string>();

  const adultsAsNumber = useMemo(
    () =>
      adults?.match(/[^$,.\d]/) ? Number.NaN : Number.parseInt(adults ?? "0"),
    [adults]
  );
  const childrenAsNumber = useMemo(
    () =>
      children?.match(/[^$,.\d]/)
        ? Number.NaN
        : Number.parseInt(children ?? "0"),
    [adults]
  );

  console.log({
    adultsAsNumber,
    children,
    isAdultsInvalid: (adults?.length ?? 0) > 0 && Number.isNaN(adultsAsNumber),
    length: adults,
    nan: adultsAsNumber,
    alskdjf: Number.isNaN(childrenAsNumber),
  });

  const isInputValid = useMemo(
    () =>
      (!Number.isNaN(adultsAsNumber) || !Number.isNaN(childrenAsNumber)) &&
      house,
    [adultsAsNumber, childrenAsNumber, house]
  );

  function upsertGuests() {
    if (!isInputValid) {
      toast({
        description: "Du skal udfylde alle felterne",
        status: "error",
      });
      return;
    }

    toast.closeAll();

    const adultsSafe = Number.isNaN(adultsAsNumber) ? 0 : adultsAsNumber;
    const childrenSafe = Number.isNaN(childrenAsNumber) ? 0 : childrenAsNumber;

    commit({
      variables: {
        houseNumber: house!,
        menuPlanId: props.menuPlanId,
        adults: adultsSafe,
        children: childrenSafe,
      },
      onCompleted: () => {
        toast({
          title: "Gæster tilføjet",
          status: "success",
          description: `Du tilføjede ${adultsSafe} voksne og ${childrenSafe} børn til hus ${house}`,
        });

        setAdults("");
        setChildren("");
        setHouse("");
      },
      onError: (err) => {
        toast({
          title: "Gæsterne kunne ikke tilføjes",
          status: "error",
          description: (
            <Button onClick={() => upsertGuests()} variant="outline" size="sm">
              Prøv igen
            </Button>
          ),
          duration: null,
          isClosable: true,
        });
      },
    });
  }

  return (
    <Stack spacing="2">
      <Text>Tilmeld gæster:</Text>

      <Input
        onTouchStart={props.onFieldTouched}
        placeholder="Antal voksne"
        errorBorderColor="red.300"
        value={adults}
        onChange={(v) => setAdults(v.target.value)}
        isInvalid={(adults?.length ?? 0) > 0 && Number.isNaN(adultsAsNumber)}
      />
      <Input
        onTouchStart={props.onFieldTouched}
        placeholder="Antal voksne"
        errorBorderColor="red.300"
        value={children}
        onChange={(v) => setChildren(v.target.value)}
        isInvalid={
          (children?.length ?? 0) > 0 && Number.isNaN(childrenAsNumber)
        }
      />

      <Select
        onTouchStart={props.onFieldTouched}
        placeholder="Husnummer"
        value={house}
        onChange={(v) => setHouse(v.target.value)}
      >
        {props.houses.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </Select>

      <Button
        colorScheme={isInputValid ? "green" : undefined}
        onTouchStart={props.onFieldTouched}
        type="submit"
        isLoading={loading}
        onClick={upsertGuests}
      >
        Tilmeld
      </Button>
    </Stack>
  );
}
