import { DeleteIcon } from "@chakra-ui/icons";
import { useToast, IconButton } from "@chakra-ui/react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { removeFromCookingButtonMutation } from "../../../__generated__/removeFromCookingButtonMutation.graphql";

export function RemoveFromCookingButton(props: {
  residentId: string;
  date: Date;
  menuPlanId?: string;
  onUserRemovedFromNewDate: (userId: string) => void;
}) {
  const toast = useToast();

  const [remove, loading] =
    useMutation<removeFromCookingButtonMutation>(graphql`
      mutation removeFromCookingButtonMutation(
        $date: DateTime!
        $residentId: UUID
        $retainParticipation: Boolean
      ) {
        removeSignUpForCooking(
          date: $date
          residentId: $residentId
          retainParticipation: $retainParticipation
        ) {
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

  function removeSignUp() {
    remove({
      variables: {
        date: props.date.toDateOnlyISOString(),
        residentId: props.residentId,
      },
      onCompleted: (data) => {
        toast({
          title: "Du er nu fjernet fra madholdet",
          status: "success",
        });

        if (!props.menuPlanId) {
          props.onUserRemovedFromNewDate(props.residentId);
        }
      },
      onError: () => {
        toast({
          title: "Der skete en fejl",
          description: "Prøv venligst igen senere",
          status: "error",
        });
      },
    });
  }

  return (
    <IconButton
      variant="outline"
      icon={<DeleteIcon />}
      aria-label="Slet fra madholdet"
      onClick={removeSignUp}
      isDisabled={loading}
      isLoading={loading}
    />
  );
}
