import {
  Box,
  Grid,
  GridItem,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Center,
  Button,
  Spinner,
  IconButton,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { getWeekDates } from "../../utils/date-utils";
import { useMemo, useState } from "react";
import { useRecoilStateLoadable } from "recoil";
import { Recipe, Resident } from "../planner/types";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { RemoveFromCookingButton } from "./components/remove-from-cooking-button";
import { JoinCookingButton } from "./components/join-cooking-button";
import { menuPlanChefState } from "./food-team-state";

type DayWithMenuPlanAndChefs = Readonly<{
  date: Date;
  plan:
    | {
        date: Date;
        id: any;
        recipes: readonly Recipe[];
        chefs: readonly Resident[];
      }
    | undefined;
}>;

const NUMBER_OF_WEEKS_IN_GRID = 2;

export default function FoodTeamPage() {
  const now = new Date();
  const currentWeek = now.getWeek();
  const [selectedStartingWeek, setSelectedStartingWeek] = useState(currentWeek);

  return (
    <Box padding={8}>
      <Stack spacing="8">
        <Grid templateColumns="repeat(2, 1fr)" gap={8}>
          {Array.enumerate({
            from: selectedStartingWeek,
            to: selectedStartingWeek + NUMBER_OF_WEEKS_IN_GRID,
          }).map((week) => (
            <GridItem key={week} boxShadow="base" padding={8}>
              <FoodTeamWeekPlan week={week} />
            </GridItem>
          ))}
        </Grid>

        <Box>
          <Center>
            <HStack>
              <IconButton
                icon={<ChevronLeftIcon />}
                aria-label="Forrige periode"
                onClick={() =>
                  setSelectedStartingWeek(
                    selectedStartingWeek - NUMBER_OF_WEEKS_IN_GRID
                  )
                }
              />
              <Button onClick={() => setSelectedStartingWeek(currentWeek)}>
                Gå til uge {currentWeek}
              </Button>
              <IconButton
                icon={<ChevronRightIcon />}
                aria-label="Næste periode"
                onClick={() =>
                  setSelectedStartingWeek(
                    selectedStartingWeek + NUMBER_OF_WEEKS_IN_GRID
                  )
                }
              />
            </HStack>
          </Center>
        </Box>
      </Stack>
    </Box>
  );
}

function FoodTeamWeekPlan(props: { week: number }) {
  const { week } = props;
  const now = new Date();
  const daysInWeek = useMemo(
    () =>
      getWeekDates(
        week <= 52 ? week : week - 52,
        week <= 52 ? now.getFullYear() : now.getFullYear() + 1
      ),
    [week]
  );
  const [weekPlan, setWeekPlan] = useRecoilStateLoadable(
    menuPlanChefState({
      from: daysInWeek[0],
      to: daysInWeek[daysInWeek.length - 1],
    })
  );

  function addNewPlanWithUserAsChef(date: Date, user: Resident) {
    const newPlan = {
      chefs: [user],
      date: date,
      id: undefined as unknown as string, // Indicate that this is in-memory only
      recipes: [],
    };
    setWeekPlan((old) => old?.concat(newPlan));
  }

  function removeUserFromNewPlan(date: Date, userId: string) {
    setWeekPlan((old) =>
      old?.map((plan) => {
        if (plan.date.getDayOfYear() == date.getDayOfYear()) {
          return {
            ...plan,
            chefs: plan.chefs.filter((c) => c.id !== userId),
          };
        } else {
          return plan;
        }
      })
    );
  }

  const daysWithPlan: DayWithMenuPlanAndChefs[] = useMemo(
    () =>
      daysInWeek.map((d) => ({
        date: d,
        plan: weekPlan
          .valueMaybe()
          ?.find((p) => p.date.getDayOfYear() == d.getDayOfYear()),
      })),
    [daysInWeek, weekPlan]
  );

  return (
    <Stack spacing="4">
      <Text fontSize="lg" fontWeight="bold">
        Uge: {week <= 52 ? week : week - 52}
      </Text>
      {weekPlan.state === "loading" ? (
        <Center>
          <Spinner size="lg" />
        </Center>
      ) : (
        <FoodTeamWeekPlanTable
          daysInWeek={daysWithPlan}
          week={week}
          onUserSignedUpToNewPlan={addNewPlanWithUserAsChef}
          onUserRemovedFromNewPlan={removeUserFromNewPlan}
        />
      )}
    </Stack>
  );
}

function FoodTeamWeekPlanTable(props: {
  daysInWeek: DayWithMenuPlanAndChefs[];
  week: number;
  onUserSignedUpToNewPlan: (
    date: Date,
    user: Pick<Resident, "id" | "firstName" | "lastName">
  ) => void;
  onUserRemovedFromNewPlan: (date: Date, userId: string) => void;
}) {
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Dato</Th>
            <Th>Menu</Th>
            <Th>Madhold</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.daysInWeek.map((day) => (
            <Tr key={`${props.week}-${day.date.getDay()}`}>
              <Td>
                <Stack>
                  <Text fontWeight="bold">{day.date.getDanishWeekday()}</Text>
                  <Text>{day.date.toLocaleDateString()}</Text>
                </Stack>
              </Td>
              <Td>
                <Stack>
                  {day.plan?.recipes.map((r) => (
                    <Text key={r.id}>{r.name}</Text>
                  ))}
                </Stack>
              </Td>
              <Td>
                <Stack>
                  {day.plan?.chefs?.map((c) => (
                    <Flex key={c.id} justify="space-between">
                      <Center>
                        <Text>
                          {c.firstName} {c.lastName}
                        </Text>
                      </Center>
                      <RemoveFromCookingButton
                        residentId={c.id}
                        menuPlanId={day.plan?.id}
                        date={day.date}
                        onUserRemovedFromNewDate={(user) =>
                          props.onUserRemovedFromNewPlan(day.date, user)
                        }
                      />
                    </Flex>
                  ))}
                  {(day.plan?.chefs?.length ?? 0) < 2 && (
                    <JoinCookingButton
                      date={day.date}
                      menuPlanId={day.plan?.id}
                      onUserJoinedNewDate={(user) =>
                        props.onUserSignedUpToNewPlan(day.date, user)
                      }
                    />
                  )}
                </Stack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
