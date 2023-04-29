import { CheckIcon } from "@chakra-ui/icons";
import { IconButton, useToast } from "@chakra-ui/react";
import { useMutation } from "react-relay/hooks";
import { useRecoilStateLoadable } from "recoil";
import { graphql } from "relay-runtime";
import { userAttendanceState } from "../../planner/state";

const attendMutation = graphql`
  mutation toggleAttendanceButtonAttendMutation(
    $menuPlanId: UUID!
    $userId: UUID
  ) {
    attend(input: { menuPlanId: $menuPlanId, residentId: $userId }) {
      id
      participants {
        firstName
        lastName
      }
    }
  }
`;

const unattendMutation = graphql`
  mutation toggleAttendanceButtonUnattendMutation(
    $menuPlanId: UUID!
    $userId: UUID
  ) {
    unattend(input: { menuPlanId: $menuPlanId, residentId: $userId }) {
      id
      participants {
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
  const toast = useToast();

  const [userAttendance, setUserAttendance] = useRecoilStateLoadable(
    userAttendanceState(props.userId)
  );

  const [attend, attendLoading] = useMutation(attendMutation);
  const [unattend, unattendLoading] = useMutation(unattendMutation);

  const loading =
    attendLoading || unattendLoading || userAttendance.state === "loading";

  const attendsPlan = props.participantIds.includes(props.userId);

  function toggleAttendance() {
    if (props.menuPlanId == null) {
      toast({
        title: "Der er ikke oprettet nogen plan for den dag endnu",
        description: "Vent venligst med at tilmelde dig til planen er oprettet",
        status: "warning",
      });
      return;
    }

    if (attendsPlan) {
      unattend({
        variables: {
          menuPlanId: props.menuPlanId,
          userId: props.userId,
        },
        onCompleted: () => {
          toast({
            title: "Du er nu frameldt",
            status: "info",
          });
          setUserAttendance((prev) => ({
            ...prev!,
            participatesInIds: prev!.participatesInIds.filter(
              (id) => id !== props.menuPlanId
            ),
          }));
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Der skete en fejl",
            description: "Prøv igen senere",
            status: "error",
          });
        },
      });
    } else {
      attend({
        variables: {
          menuPlanId: props.menuPlanId,
          userId: props.userId,
        },
        onCompleted: () => {
          toast({
            title: "Du er nu tilmeldt",
            status: "info",
          });
          setUserAttendance((prev) => ({
            ...prev!,
            participatesInIds: [...prev!.participatesInIds, props.menuPlanId!],
          }));
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Der skete en fejl",
            description: "Prøv igen senere",
            status: "error",
          });
        },
      });
    }
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
