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
  Box,
  Text,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { ToggleAttendanceButton } from "../../login/components/toggle-attendance-button";
import { Recipes } from "../components/recipes";
import { WeekPlanGuests } from "../components/week-plan-guests";
import { selectedDaysWithParticipantsState } from "../state";
import { Resident } from "../types";
import {
  PlannerPageLayoutProviderProps,
  participantCategories,
} from "./planner-page-layout";

import style from "./table-planner.module.css";

// https://askebakken.dk/wp-content/uploads/2022/11/spiser-du-med.pdf

export function PlannerPageTable(props: PlannerPageLayoutProviderProps) {
  return (
    <TableContainer margin={4}>
      <Table className={style.plannerTable} size="sm">
        <Thead>
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
              <Center>Menu</Center>
            </Th>
            {props.menuPlans.map((d) => (
              <Td key={`menu-${d.date.getDayOfYear()}`}>
                <Center>
                  {d.recipes ? (
                    <Recipes recipes={d.recipes} />
                  ) : (
                    <Text fontStyle="italic">Intet planlagt</Text>
                  )}
                </Center>
              </Td>
            ))}
          </Tr>
          <Tr>
            <Th colSpan={2}>
              <Center>{props.menuPlans[0].date.getWeek()}</Center>
            </Th>
            {props.menuPlans.map((d) => (
              <Th key={`categories-${d.date.getDayOfYear()}`}>
                <PlannerTableEntry entries={participantCategories} />
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {props.houses.map((house) => (
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
            {props.menuPlans.map((d) => (
              <Th key={`total-${d.date.getDayOfYear()}`}>
                <PlannerTableEntry
                  entries={[
                    <Stack width="100%" padding="0 8px">
                      <Flex justify="space-between">
                        <Box>Voksne:</Box>
                        <Box>
                          {d.participants.filter((p) =>
                            p ? !props.residentById?.get(p.id)?.child : false
                          )?.length ?? 0}
                        </Box>
                      </Flex>
                      <Flex justify="space-between">
                        <Box>Børn:</Box>
                        <Box>
                          {d.participants.filter((p) =>
                            p ? props.residentById?.get(p.id)?.child : false
                          )?.length ?? 0}
                        </Box>
                      </Flex>
                    </Stack>,
                    <Center>
                      {d.guests?.sumBy((g) => g.numberOfAdultGuests) ?? 0}
                    </Center>,
                    <Center>
                      {d.guests?.sumBy((g) => g.numberOfChildGuests) ?? 0}
                    </Center>,
                  ]}
                />
              </Th>
            ))}
          </Tr>
        </Tfoot>
      </Table>
    </TableContainer>
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
                    plan.participants
                      .map((p) => p?.id)
                      .filter((p) => !!p)
                      .map((p) => p!) ?? []
                  }
                  userId={props.resident.id}
                  menuPlanId={plan.id}
                />
              </Center>,
              guestProps.withGuests ? (
                <WeekPlanGuests
                  for="ADULTS"
                  defaultValue={
                    plan.guests.find(
                      (g) => g.houseNumber === guestProps.houseNumber
                    )?.numberOfAdultGuests ?? 0
                  }
                  menuPlanId={plan.id}
                  houseNumber={guestProps.houseNumber}
                />
              ) : null,
              guestProps.withGuests ? (
                <WeekPlanGuests
                  for="CHILDREN"
                  defaultValue={
                    plan.guests.find(
                      (g) => g.houseNumber === guestProps.houseNumber
                    )?.numberOfChildGuests ?? 0
                  }
                  menuPlanId={plan.id}
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

function PlannerTableEntry(props: { entries: Readonly<React.ReactNode[]> }) {
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
