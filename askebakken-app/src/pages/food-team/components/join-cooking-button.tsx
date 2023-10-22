import { useToast, Stack, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-relay";
import { useRecoilValue } from "recoil";
import { graphql } from "relay-runtime";
import { devicePreferences } from "../../../app-state/device-preferences";
import { joinCookingButtonMutation } from "../../../__generated__/joinCookingButtonMutation.graphql";
import { Resident } from "../../planner/types";
import { ResidentSelect } from "../../../components/resident-select";

export function JoinCookingButton(props: {
  date: Date;
  menuPlanId: string | undefined;
  onUserJoinedNewDate: (
    user: Pick<Resident, "id" | "firstName" | "lastName">
  ) => void;
}) {
  const toast = useToast();

  const [selectedResident, setSelectedResident] = useState<string>();

  const devicePrefs = useRecoilValue(devicePreferences);

  const joinButtonDisabled =
    devicePrefs.appDisplayMode === "SYSTEM" && !selectedResident;

  const [join, loading] = useMutation<joinCookingButtonMutation>(graphql`
    mutation joinCookingButtonMutation($date: DateTime!, $residentId: UUID) {
      signUpForCooking(date: $date, residentId: $residentId) {
        id
        date
        chefs {
          id
          firstName
          lastName
        }
      }
    }
  `);
  function signUpForCooking() {
    join({
      variables: {
        date: props.date.toDateOnlyISOString(),
        residentId: selectedResident,
      },
      onCompleted: (data) => {
        toast({
          title: "Du er nu skrevet på madholdet",
          status: "success",
        });

        if (!props.menuPlanId) {
          props.onUserJoinedNewDate(data.signUpForCooking.chefs[0]);
        }
      },
      onError: (error) => {
        const errorMessage = (error as any).source.errors[0].extensions.message;
        const desc = errorMessage.includes("EventIsInThePastError")
          ? "Du kan ikke tilmelde dig til madlavning bag ud i tid"
          : "Måske er der allerede 2 på madholdet";

        toast({
          title: "Der skete en fejl",
          description: desc,
          status: "error",
        });
      },
    });
  }

  return (
    <Stack>
      {devicePrefs.appDisplayMode === "SYSTEM" && (
        <ResidentSelect
          placeholder="Hvem vil du tilmelde?"
          onChange={setSelectedResident}
        />
      )}
      <Button
        onClick={signUpForCooking}
        isLoading={loading}
        isDisabled={joinButtonDisabled || loading}
        colorScheme="green"
        variant="outline"
      >
        Tilmeld dig
      </Button>
    </Stack>
  );
}
