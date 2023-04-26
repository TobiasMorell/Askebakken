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
  IconButton,
  Input,
  Center,
  Stack,
} from "@chakra-ui/react";
import style from "./planner-page.module.css";
import { CheckIcon } from "@chakra-ui/icons";
import { useRecoilValue } from "recoil";
import { useMemo } from "react";
import { Recipes } from "./components/recipes";
import { selectedDaysWithParticipantsState, residentsState } from "./state";
import { Resident } from "./types";
import { useAutomaticWeekChange } from "./hooks";
import { ToggleAttendanceButton } from "../login/components/toggle-attendance-button";

// https://askebakken.dk/wp-content/uploads/2022/11/spiser-du-med.pdf

const participantCategories = ["Voksen", "Voksen gæst", "Barn gæst"];

export function PlannerPage() {
  useAutomaticWeekChange();
  const dateSelection = useRecoilValue(selectedDaysWithParticipantsState);

  const residents = useRecoilValue(residentsState);
  const houses = useMemo(
    () => [...new Set(residents?.map((r) => r.houseNumber))].sort(),
    [residents]
  );
  const residentByHouse = useMemo(() => {
    const result: Record<string, Resident[]> = {};
    residents?.forEach((r) => {
      if (!result[r.houseNumber]) {
        result[r.houseNumber] = [];
      }
      result[r.houseNumber].push(r);
    });
    return result;
  }, [residents]);

  return (
    <TableContainer margin={4}>
      <Table className={style.plannerTable} size="sm">
        <Thead>
          <Tr>
            <Th colSpan={2}>
              <Center>Uge</Center>
            </Th>

            {dateSelection.map((d) => (
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
            {dateSelection.map((d) => (
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
              <Center>{dateSelection[0].date.getWeek()}</Center>
            </Th>
            {dateSelection.map((d) => (
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
              residents={residentByHouse[house]}
            />
          ))}
        </Tbody>
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

function ResidentRowEntries(props: {
  resident: Resident;
  entryClassName?: string;
  withGuests?: boolean;
}) {
  const dateSelection = useRecoilValue(selectedDaysWithParticipantsState);

  return (
    <>
      <Td className={props.entryClassName}>
        <Box padding={4}>{props.resident.firstName}</Box>
      </Td>

      {dateSelection.map((plan) => (
        <Td
          className={props.entryClassName}
          key={`entries-${plan.date.getDayOfYear()}`}
        >
          <PlannerTableEntry
            entries={[
              <Center>
                <ToggleAttendanceButton
                  menuPlanId={plan.plan?.id}
                  userId={props.resident.id}
                />
              </Center>,
              props.withGuests ? (
                <Input type="number" placeholder="Antal" />
              ) : null,
              props.withGuests ? (
                <Input type="number" placeholder="Antal" />
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
