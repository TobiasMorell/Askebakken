import { CheckIcon } from "@chakra-ui/icons";
import { IconButton, useToast } from "@chakra-ui/react";
import { useMemo } from "react";
import { useMutation } from "react-relay/hooks";
import { graphql } from "relay-runtime";

const toggleAttendanceMutation = graphql`
  mutation toggleAttendanceButtonMutation($menuPlanId: UUID!, $userId: UUID) {
    toggleAttendance(input: { menuPlanId: $menuPlanId, residentId: $userId }) {
      id
      participants {
        id
        firstName
        lastName
      }
    }
  }
`;

export function ToggleAttendanceButton(props: {
  userId: string;
  menuPlanId: string | undefined;
  participantIds: string[];
}) {
  const { participantIds, userId } = props;
  const toast = useToast();

  const [toggle, loading] = useMutation(toggleAttendanceMutation);

  const attendsPlan = useMemo(
    () => participantIds.includes(userId),
    [participantIds, userId]
  );

  function toggleAttendance() {
    toggle({
      variables: {
        menuPlanId: props.menuPlanId,
        userId,
      },
      onCompleted: () => {
        toast({
          title: attendsPlan ? "Du er nu frameldt" : "Du er nu tilmeldt",
          status: "success",
        });
      },
      onError: (error) => {
        toast({
          title: "Der skete en fejl",
          description: "Prøv igen senere",
          status: "error",
        });
      },
    });
  }

  return (
    <IconButton
      aria-label="Deltager"
      icon={<CheckIcon />}
      isLoading={loading}
      colorScheme={attendsPlan ? "green" : undefined}
      onClick={toggleAttendance}
    />
  );
}
