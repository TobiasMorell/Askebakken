import { useToast, IconButton } from "@chakra-ui/react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { ChefHatIcon } from "../../../components/chef-hat-icon";
import { joinCookingCardButton_JoinMutation } from "../../../__generated__/joinCookingCardButton_JoinMutation.graphql";
import { joinCookingCardButton_LeaveCookingMutation } from "../../../__generated__/joinCookingCardButton_LeaveCookingMutation.graphql";

const joinCookingMutation = graphql`
  mutation joinCookingCardButton_JoinMutation(
    $date: DateTime!
    $residentId: UUID
  ) {
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
`;
const leaveCookingMutation = graphql`
  mutation joinCookingCardButton_LeaveCookingMutation(
    $date: DateTime!
    $resident: UUID!
  ) {
    removeSignUpForCooking(
      date: $date
      residentId: $resident
      retainParticipation: true
    ) {
      id
    }
  }
`;

export function ToggleCookingCardButton(props: {
  date: Date;
  userId: string;
  isChef: boolean;
}) {
  const toast = useToast();

  const [doGraphQLJoin, loading] =
    useMutation<joinCookingCardButton_JoinMutation>(joinCookingMutation);
  const [doGraphQLLeave, leaveLoading] =
    useMutation<joinCookingCardButton_LeaveCookingMutation>(
      leaveCookingMutation
    );

  function joinCooking() {
    doGraphQLJoin({
      variables: {
        date: props.date.toDateOnlyISOString(),
        residentId: props.userId,
      },
      onCompleted: (data) => {
        toast({
          title: "Du er nu skrevet på madholdet",
          status: "success",
        });
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

  function leaveCooking() {
    doGraphQLLeave({
      variables: {
        date: props.date.toDateOnlyISOString(),
        resident: props.userId,
      },
      onCompleted: (data) => {
        toast({
          title: "Du er nu fjernet fra madholdet",
          status: "success",
        });
      },
      onError: (error) => {
        const errorMessage = (error as any).source.errors[0].extensions.message;
        const desc = errorMessage.includes("EventIsInThePastError")
          ? "Du kan ikke framelde dig fra madholdet bag ud i tid"
          : "En ukendt fejl opstod - kontakt Tobias";

        toast({
          title: "Der skete en fejl",
          description: desc,
          status: "error",
        });
      },
    });
  }

  return (
    <IconButton
      onClick={props.isChef ? leaveCooking : joinCooking}
      isLoading={loading || leaveLoading}
      isDisabled={loading || leaveLoading}
      colorScheme={props.isChef ? "green" : undefined}
      aria-label={props.isChef ? "Frameld madlavning" : "Tilmeld madlavning"}
    >
      <ChefHatIcon color={props.isChef ? "white" : undefined} />
    </IconButton>
  );
}
