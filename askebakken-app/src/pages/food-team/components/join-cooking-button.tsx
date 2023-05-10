import { useToast, Stack, Button, Text, Select } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-relay";
import { useRecoilValue } from "recoil";
import { graphql } from "relay-runtime";
import { appDisplayModeState } from "../../../app-state/app-display-mode";
import { joinCookingButtonMutation } from "../../../__generated__/joinCookingButtonMutation.graphql";
import { Resident } from "../../planner/types";
import { ResidentSelect } from "../../../components/resident-select";

export function JoinCookingButton(props: {
  date: Date;
  menuPlanId: string | undefined;
  onUserJoinedNewDate: (user: Resident) => void;
}) {
  const toast = useToast();

  const [selectedResident, setSelectedResident] = useState<string>();

  const appDisplayMode = useRecoilValue(appDisplayModeState);

  const joinButtonDisabled = appDisplayMode === "SYSTEM" && !selectedResident;

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
        toast({
          title: "Der skete en fejl",
          description: "Måske er der allerede 2 på madholdet",
          status: "error",
        });
      },
    });
  }

  return (
    <Stack>
      {appDisplayMode === "SYSTEM" && (
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
