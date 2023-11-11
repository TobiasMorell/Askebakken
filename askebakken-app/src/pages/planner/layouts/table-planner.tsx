import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Center,
  Td,
  Stack,
  Tbody,
  Tfoot,
  Flex,
  Text,
  Box,
  Image,
  IconButton,
  useDisclosure,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  AspectRatio,
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { ToggleAttendanceButton } from "../../login/components/toggle-attendance-button";
import {
  loggedInUserHouse,
  selectedDaysWithParticipantsState,
} from "../menu-planner-state";
import { Resident } from "../types";
import { PlannerPageLayoutProviderProps } from "./planner-page-layout";

import style from "./table-planner.module.css";
import { devicePreferences } from "../../../app-state/device-preferences";
import { useEffect, useMemo, useState } from "react";
import { WeekNavigation } from "../components/week-navigation";
import { MenuPlanName } from "../components/menu-plan-name";
import { CalendarIcon } from "@chakra-ui/icons";
import { useDelayedAction } from "../../../hooks/useDelayedAction";
import { AddGuestsForm } from "../components/week-plan-guests";

// https://askebakken.dk/wp-content/uploads/2022/11/spiser-du-med.pdf

function useParticipantCount(
  d: PlannerPageLayoutProviderProps["menuPlans"][0],
  residentById: PlannerPageLayoutProviderProps["residentById"]
) {
  const totalAdultParticipants = useMemo(() => {
    const totalAdultResidents =
      d.participants.filter((p) =>
        p ? !residentById?.get(p.id)?.child : false
      )?.length ?? 0;
    const totalAdultGuests = d.guests?.sumBy((g) => g.numberOfAdultGuests) ?? 0;
    return totalAdultResidents + totalAdultGuests;
  }, [d, residentById]);

  const totalChildParticipants = useMemo(() => {
    const totalChildResidents =
      d.participants.filter((p) => (p ? residentById?.get(p.id)?.child : false))
        ?.length ?? 0;
    const totalChildGuests = d.guests?.sumBy((g) => g.numberOfChildGuests) ?? 0;

    return totalChildResidents + totalChildGuests;
  }, [d, residentById]);

  return [totalAdultParticipants, totalChildParticipants] as const;
}

export function PlannerPageTable(props: PlannerPageLayoutProviderProps) {
  const userHouse = useRecoilValue(loggedInUserHouse);
  const prefs = useRecoilValue(devicePreferences);

  const housesToDisplay = useMemo(
    () =>
      prefs.appDisplayMode === "RESIDENT"
        ? props.houses.filter((h) => h === userHouse)
        : props.houses,
    [prefs, props.houses, userHouse]
  );

  return (
    <Stack>
      <TableContainer margin={2} overflowY="unset" overflowX="unset">
        <Table className={style.plannerTable} size="sm">
          <Thead position="sticky" top={0} zIndex="docked">
            <Tr>
              <Th colSpan={2}>
                <Center>Uge</Center>
              </Th>

              {props.menuPlans.map((d) => (
                <Td key={`name-${d.date.getDayOfYear()}`}>
                  <Stack padding={4}>
                    <Center>
                      <Box fontWeight="bold">{d.date.getDanishWeekday()}</Box>
                    </Center>
                    <Center>
                      <Box>{d.date.toLocaleDateString()}</Box>
                    </Center>
                  </Stack>
                </Td>
              ))}
            </Tr>

            <Tr>
              <Th colSpan={2}>
                <Center>{props.menuPlans?.[0]?.date.getWeek() ?? ""}</Center>
              </Th>

              {props.menuPlans.map((d) => (
                <Td key={d.date.getDayOfYear()}>
                  <Center>
                    <OpenMenuPlanButton menuPlan={d} houses={props.houses} />
                  </Center>
                </Td>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {housesToDisplay.map((house) => (
              <PlannerTableHouseEntry
                key={house}
                house={house}
                residents={props.residentsByHouse?.get(house) ?? []}
              />
            ))}
          </Tbody>
          <Tfoot>
            <Tr borderBottom="2px solid black" borderTop="3px solid black">
              <Th colSpan={2} background="gray.100">
                <Center>Total</Center>
              </Th>
              {props.menuPlans.map((d) => {
                const [totalAdultParticipants, totalChildParticipants] =
                  useParticipantCount(d, props.residentById);

                return (
                  <Th key={`total-${d.date.getDayOfYear()}`}>
                    <PlannerTableEntry
                      entries={[
                        <Stack width="100%" padding="0 8px">
                          <Flex justify="space-between">
                            <Box>Voksne:</Box>
                            <Box>{totalAdultParticipants}</Box>
                          </Flex>
                          <Flex justify="space-between">
                            <Box>Børn:</Box>
                            <Box>{totalChildParticipants}</Box>
                          </Flex>
                        </Stack>,
                      ]}
                    />
                  </Th>
                );
              })}
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>

      <Center>
        <WeekNavigation />
      </Center>
    </Stack>
  );
}

function PlannerTableHouseEntry(props: {
  house: string;
  residents: Resident[];
}) {
  return (
    <>
      <Tr>
        <Td rowSpan={props.residents.length}>
          <Box padding={4}>{props.house}</Box>
        </Td>
        <ResidentRowEntries
          resident={props.residents[0]}
          entryClassName={
            props.residents.length > 1 ? style["no-bottom-border"] : undefined
          }
        />
      </Tr>
      {props.residents.slice(1).map((r, idx) => (
        <Tr className={style["no-border"]} key={`${props.house}-${idx}`}>
          <ResidentRowEntries
            resident={r}
            entryClassName={`${style["no-top-border"]} ${
              idx < props.residents.length - 2 ? style["no-bottom-border"] : ""
            }`}
          />
        </Tr>
      ))}
    </>
  );
}
type ResidentRowEntriesProps = {
  resident: Resident;
  entryClassName?: string;
};

function ResidentRowEntries(props: ResidentRowEntriesProps) {
  const menuPlans = useRecoilValue(selectedDaysWithParticipantsState);

  return (
    <>
      <Td className={props.entryClassName}>
        <Box padding={4}>{props.resident.firstName}</Box>
      </Td>

      {menuPlans.map((plan) => (
        <Td
          className={props.entryClassName}
          key={`entries-${plan.date.getDayOfYear()}`}
        >
          <Center>
            <ToggleAttendanceButton
              participantIds={
                plan.participants
                  .map((p) => p?.id)
                  .filter((p) => !!p)
                  .map((p) => p!) ?? []
              }
              userId={props.resident.id}
              menuPlanId={plan.id}
            />
          </Center>
        </Td>
      ))}
    </>
  );
}

function PlannerTableEntry(props: { entries: Readonly<React.ReactNode[]> }) {
  return (
    <Flex height="100%">
      {props.entries.map((e, idx) => (
        <Box
          flex="1"
          borderLeft={idx > 0 ? "1px" : undefined}
          borderRight={idx < props.entries.length - 1 ? "1px" : undefined}
          borderColor="black"
          padding="4px"
          key={idx}
        >
          <Center height="100%">{e}</Center>
        </Box>
      ))}
    </Flex>
  );
}

function OpenMenuPlanButton(props: {
  menuPlan: PlannerPageLayoutProviderProps["menuPlans"][0];
  houses: string[];
}) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { start, cancel, secondsRemaining } = useDelayedAction(15, onClose);

  const [hasTouchedField, setHasTocuhedField] = useState(false);

  const { menuPlan } = props;
  const closeManual = () => {
    cancel();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      start();
    } else {
      setHasTocuhedField(false);
    }
  }, [isOpen]);

  const cancelAutoClose = () => {
    cancel();
    setHasTocuhedField(true);
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label="Åben menuplan"
        icon={<CalendarIcon />}
      />
      <Modal isOpen={isOpen} onClose={closeManual}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Madplan for {menuPlan.date.getDanishWeekday()} d.{" "}
            {menuPlan.date.toLocaleDateString()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="8">
              {menuPlan.thumbnail && (
                <AspectRatio ratio={1}>
                  <Image
                    src={menuPlan.thumbnail ?? ""}
                    alt="Der mangler et billede her"
                  />
                </AspectRatio>
              )}

              <Box>
                <MenuPlanName menuPlan={menuPlan} />
              </Box>

              <AddGuestsForm
                menuPlanId={menuPlan.id}
                onFieldTouched={cancelAutoClose}
                houses={props.houses}
              />
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={closeManual}>
              Luk {hasTouchedField ? "" : `(${secondsRemaining})`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
