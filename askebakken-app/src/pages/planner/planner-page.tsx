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
  useInterval,
} from "@chakra-ui/react";
import style from "./planner-page.module.css";
import { ChevronRightIcon, ChevronLeftIcon, CheckIcon } from "@chakra-ui/icons";
import { atom, selector, useRecoilValue, useSetRecoilState } from "recoil";
import { graphQLSelector } from "recoil-relay";
import { RelayEnvironment } from "../../RelayEnvironment";
import { graphql } from "react-relay";
import { plannerPageResidentsQuery$data } from "../../__generated__/plannerPageResidentsQuery.graphql";
import { plannerPageMenuPlansQuery$data } from "../../__generated__/plannerPageMenuPlansQuery.graphql";
import { useMemo } from "react";

// https://askebakken.dk/wp-content/uploads/2022/11/spiser-du-med.pdf

const participantCategories = ["Voksen", "Voksen gæst", "Barn gæst"];
const residentsState = graphQLSelector({
  key: "residents",
  environment: RelayEnvironment,
  query: graphql`
    query plannerPageResidentsQuery {
      residents {
        nodes {
          id
          firstName
          lastName
          houseNumber
        }
      }
    }
  `,
  variables: {},
  mapResponse: (r: plannerPageResidentsQuery$data) => r.residents?.nodes,
});

function getStartOfPlan() {
  const now = new Date();
  if (now.getDay() > 5) {
    // Skip to next monday
    now.setDate(now.getDate() + (8 - now.getDay()));
  } else {
    // Skip to previous monday
    now.setDate(now.getDate() - (now.getDay() - 1));
  }

  return now;
}

function getEndOfPlan() {
  const start = getStartOfPlan();
  start.setDate(start.getDate() + 4);
  return start;
}

const startDateState = atom({
  key: "startDate",
  default: getStartOfPlan(),
});

const endDateState = atom({
  key: "endDate",
  default: getEndOfPlan(),
});

const selectedDaysState = selector<Date[]>({
  key: "selectedDays",
  get: ({ get }) => {
    const startDate = useRecoilValue(startDateState);
    const endDate = useRecoilValue(endDateState);

    const diff = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    return [...Array(diffDays + 1).keys()].map((i) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      return d;
    });
  },
});

type Resident = Readonly<{
  firstName: string | null;
  lastName: string | null;
}>;

type Recipe = {
  readonly id: string;
  readonly name: string | null;
};

const menuPlanParticipantsState = graphQLSelector({
  key: "menuPlanParticipants",
  environment: RelayEnvironment,
  query: graphql`
    query plannerPageMenuPlansQuery($startDate: DateTime, $endDate: DateTime) {
      menuPlan(
        where: {
          and: [{ date: { gte: $startDate } }, { date: { lte: $endDate } }]
        }
      ) {
        nodes {
          id
          date
          recipes {
            id
            name
          }
          participants {
            firstName
            lastName
            houseNumber
          }
        }
      }
    }
  `,
  variables: ({ get }) => ({
    startDate: get(startDateState).toDateOnlyISOString(),
    endDate: get(endDateState).toDateOnlyISOString(),
  }),
  mapResponse: (r: plannerPageMenuPlansQuery$data) => {
    return r.menuPlan?.nodes?.map((n) => ({ ...n, date: new Date(n.date) }));
  },
});

const weekday = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
];

const selectedDaysWithParticipantsState = selector({
  key: "selectedDaysWithParticipants",
  get: ({ get }) => {
    const selectedDays = get(selectedDaysState);
    const participants = get(menuPlanParticipantsState);

    return selectedDays.map((d) => ({
      date: d,
      dateName: weekday[d.getDay()],
      plan: participants?.find(
        (p) => p.date.getDayOfYear() === d.getDayOfYear()
      ),
    }));
  },
});

function useAutomaticWeekChange() {
  const setStartDate = useSetRecoilState(startDateState);
  const setEndDate = useSetRecoilState(endDateState);

  const everyHour = 1000 * 60 * 60;

  useInterval(() => {
    const now = new Date();
    // Saturday morning after 6:00
    if (now.getDay() === 6 && now.getHours() >= 6 && now.getHours() < 7) {
      const weekStart = getStartOfPlan();
      const endDate = getEndOfPlan();

      setStartDate(weekStart);
      setEndDate(endDate);
    }
  }, everyHour);
}

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
                    <Box fontWeight="bold">{weekday[d.date.getDay()]}</Box>
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

function Recipes(props: { recipes: readonly Recipe[] }) {
  return (
    <Stack padding={4}>
      {props.recipes?.map((r, idx) => (
        <Center key={r.id}>
          <Text>{r.name}</Text>
        </Center>
      ))}
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
          entryClassName={style["no-bottom-border"]}
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
}) {
  const dateSelection = useRecoilValue(selectedDaysWithParticipantsState);

  return (
    <>
      <Td className={props.entryClassName}>
        <Box padding={4}>{props.resident.firstName}</Box>
      </Td>

      {dateSelection.map((plan, idx) => (
        <Td
          className={props.entryClassName}
          key={`entries-${plan.date.getDayOfYear()}`}
        >
          <PlannerTableEntry
            entries={[
              <Center>
                <IconButton aria-label="Deltager" icon={<CheckIcon />} />
              </Center>,
              <Input type="number" placeholder="Antal" />,
              <Input type="number" placeholder="Antal" />,
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
