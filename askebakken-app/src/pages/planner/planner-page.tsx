import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Flex,
  Text,
  Input,
  Center,
  Stack,
  Tfoot,
} from "@chakra-ui/react";
import style from "./planner-page.module.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useMemo } from "react";
import { Recipes } from "./components/recipes";
import {
  selectedDaysWithParticipantsState,
  residentsState,
  menuPlanParticipantsState,
  selectedDaysState,
} from "./state";
import { Guests, Resident } from "./types";
import { useAutomaticWeekChange } from "./hooks";
import { ToggleAttendanceButton } from "../login/components/toggle-attendance-button";
import { RealTimeParticipantStatus } from "./components/RealTimeParticipantStatus";
import { groupBy, sumBy, toDictionary } from "../../utils/array-utils";
import { WeekPlanGuests } from "./components/week-plan-guests";

// https://askebakken.dk/wp-content/uploads/2022/11/spiser-du-med.pdf

const participantCategories = ["Voksen", "Voksen gæst", "Barn gæst"];

export function PlannerPage() {
  useAutomaticWeekChange();
  const menuPlans = useRecoilValue(selectedDaysWithParticipantsState);

  const residents = useRecoilValue(residentsState);
  const houses = useMemo(
    () => [...new Set(residents?.map((r) => r.houseNumber))].sort(),
    [residents]
  );
  const residentsByHouse = useMemo(() => {
    return groupBy(residents ?? [], (r) => r.houseNumber);
  }, [residents]);
  const residentById = useMemo(() => {
    return toDictionary(residents ?? [], (r) => r.id);
  }, [residents]);

  return (
    <>
      <RealTimeParticipantStatus />
      <TableContainer margin={4}>
        <Table className={style.plannerTable} size="sm">
          <Thead>
            <Tr>
              <Th colSpan={2}>
                <Center>Uge</Center>
              </Th>

              {menuPlans.map((d) => (
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
                <Center>Menu</Center>
              </Th>
              {menuPlans.map((d) => (
                <Td key={`menu-${d.date.getDayOfYear()}`}>
                  <Center>
                    {d.plan?.recipes ? (
                      <Recipes recipes={d.plan.recipes} />
                    ) : (
                      <Text fontStyle="italic">Intet planlagt</Text>
                    )}
                  </Center>
                </Td>
              ))}
            </Tr>
            <Tr>
              <Th colSpan={2}>
                <Center>{menuPlans[0].date.getWeek()}</Center>
              </Th>
              {menuPlans.map((d) => (
                <Th key={`categories-${d.date.getDayOfYear()}`}>
                  <PlannerTableEntry entries={participantCategories} />
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {houses.map((house) => (
              <PlannerTableHouseEntry
                key={house}
                house={house}
                residents={residentsByHouse.get(house) ?? []}
              />
            ))}
          </Tbody>
          <Tfoot>
            <Tr borderBottom="2px solid black" borderTop="3px solid black">
              <Th colSpan={2} background="gray.100">
                <Center>Total</Center>
              </Th>
              {menuPlans.map((d) => (
                <Th key={`total-${d.date.getDayOfYear()}`}>
                  <PlannerTableEntry
                    entries={[
                      <Stack width="100%" padding="0 8px">
                        <Flex justify="space-between">
                          <Box>Voksne:</Box>
                          <Box>
                            {d.plan?.participants.filter(
                              (p) => residentById.get(p?.id)?.child
                            )?.length ?? 0}
                          </Box>
                        </Flex>
                        <Flex justify="space-between">
                          <Box>Børn:</Box>
                          <Box>
                            {d.plan?.participants.filter(
                              (p) => residentById.get(p?.id)?.child
                            )?.length ?? 0}
                          </Box>
                        </Flex>
                      </Stack>,
                      <Center>
                        {sumBy(
                          d.plan?.guests ?? [],
                          (g) => g.numberOfAdultGuests
                        )}
                      </Center>,
                      <Center>
                        {sumBy(
                          d.plan?.guests ?? [],
                          (g) => g.numberOfChildGuests
                        )}
                      </Center>,
                    ]}
                  />
                </Th>
              ))}
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
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
          withGuests
          houseNumber={props.house}
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
type ResidentRowEntriesPropsWithGuests = {
  withGuests: true;
  houseNumber: string;
};

function ResidentRowEntries(
  props: ResidentRowEntriesProps & (ResidentRowEntriesPropsWithGuests | {})
) {
  const menuPlans = useRecoilValue(selectedDaysWithParticipantsState);

  const guestProps = props as ResidentRowEntriesPropsWithGuests;

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
          <PlannerTableEntry
            entries={[
              <Center>
                <ToggleAttendanceButton
                  participantIds={
                    plan.plan?.participants
                      .map((p) => p?.id)
                      .filter((p) => !!p)
                      .map((p) => p!) ?? []
                  }
                  userId={props.resident.id}
                  menuPlanId={plan.plan?.id}
                />
              </Center>,
              guestProps.withGuests ? (
                <WeekPlanGuests
                  for="ADULTS"
                  defaultValue={
                    plan.plan?.guests.find(
                      (g) => g.houseNumber === guestProps.houseNumber
                    )?.numberOfAdultGuests ?? 0
                  }
                  menuPlanId={plan.plan?.id}
                  houseNumber={guestProps.houseNumber}
                />
              ) : null,
              guestProps.withGuests ? (
                <WeekPlanGuests
                  for="CHILDREN"
                  defaultValue={
                    plan.plan?.guests.find(
                      (g) => g.houseNumber === guestProps.houseNumber
                    )?.numberOfChildGuests ?? 0
                  }
                  menuPlanId={plan.plan?.id}
                  houseNumber={guestProps.houseNumber}
                />
              ) : null,
            ]}
          />
        </Td>
      ))}
    </>
  );
}

function PlannerTableEntry(props: { entries: React.ReactNode[] }) {
  return (
    <Flex height="100%">
      {props.entries.map((e, idx) => (
        <Box
          borderLeft={idx > 0 ? "1px" : undefined}
          borderRight={idx < props.entries.length - 1 ? "1px" : undefined}
          borderColor="black"
          padding="4px"
          width="120px"
          key={idx}
        >
          <Center height="100%">{e}</Center>
        </Box>
      ))}
    </Flex>
  );
}
