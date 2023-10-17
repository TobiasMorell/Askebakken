import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Tooltip,
  Tr,
  UnorderedList,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  ChangeEventHandler,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { graphQLSelector } from "recoil-relay";
import { RelayEnvironment } from "../../RelayEnvironment";
import { createMenuPlanPageMenuPlansBetweenQuery$data } from "../../__generated__/createMenuPlanPageMenuPlansBetweenQuery.graphql";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { graphql, useMutation } from "react-relay";
import {
  CreateDayPlanInput,
  CreateRecipeInput,
  createMenuPlanPageMutation$variables,
} from "../../__generated__/createMenuPlanPageMutation.graphql";
import { getWeekDates } from "../../utils/date-utils";

type MenuPlanWithOptionalId = Omit<MenuPlan, "id"> & { id: string | undefined };

const selectedWeek = atom({
  key: "selectedWeek",
  default: new Date().getWeek(),
});

const selectedYear = atom({
  key: "selectedYear",
  default: new Date().getFullYear(),
});

const startDate = selector({
  key: "createMenuPlan_startDate",
  get: ({ get }) => getWeekDates(get(selectedWeek), get(selectedYear))[0],
});

const endDate = selector({
  key: "createMenuPlan_endDate",
  get: ({ get }) => getWeekDates(get(selectedWeek), get(selectedYear))[4],
});

const createWeekPlan = graphql`
  mutation createMenuPlanPageMutation($input: CreateWeekPlanInput!) {
    createWeekPlan(createWeekPlan: $input) {
      id
    }
  }
`;

const menuPlansInWeek = graphQLSelector({
  key: "menuPlansInWeek",
  query: graphql`
    query createMenuPlanPageMenuPlansBetweenQuery(
      $fromDate: DateTime!
      $toDate: DateTime!
    ) {
      menuPlan(
        where: {
          and: [{ date: { gte: $fromDate } }, { date: { lte: $toDate } }]
        }
      ) {
        nodes {
          id
          date
          thumbnail
          recipes {
            name
            category
          }
        }
      }
    }
  `,
  environment: RelayEnvironment,
  variables: ({ get }) => {
    const vars = {
      fromDate: get(startDate).toDateOnlyISOString(),
      toDate: get(endDate).toDateOnlyISOString(),
    };

    return vars;
  },
  mapResponse: (r: createMenuPlanPageMenuPlansBetweenQuery$data): MenuPlan[] =>
    r.menuPlan?.nodes?.map((n) => ({
      ...n,
      date: new Date(n.date),
      thumbnail: n.thumbnail ?? undefined,
    })) ?? [],
});

type MenuPlan = Readonly<{
  date: Date;
  id: string;
  thumbnail?: string;
  recipes: ReadonlyArray<{
    category: string;
    name: string;
  }>;
}>;

export default function CreateMenuPlanPage() {
  const [week, setWeek] = useRecoilState(selectedWeek);
  const [year, setYear] = useRecoilState(selectedYear);

  return (
    <Box padding={4}>
      <Stack>
        <HStack>
          <Box>Madplan for uge:</Box>
          <Select
            placeholder="Uge"
            value={week}
            onChange={(v) => setWeek(Number.parseInt(v.target.value))}
            width="200px"
          >
            {Array.enumerate({ to: 52 }).map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Select>
          <Box>år:</Box>
          <Select
            placeholder="År"
            value={year}
            onChange={(v) => setYear(Number.parseInt(v.target.value))}
            width="200px"
          >
            {Array.enumerate({ to: 10 }).map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Select>
        </HStack>

        <Suspense
          fallback={
            <Center>
              <Spinner size="xl" />
            </Center>
          }
        >
          <WeekPlannerTable />
        </Suspense>
      </Stack>
    </Box>
  );
}

function WeekPlannerTable() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const week = useRecoilValue(selectedWeek);
  const year = useRecoilValue(selectedYear);
  const weekDates = useMemo(() => getWeekDates(week, year), [week, year]);

  const menuPlans = useRecoilValue<MenuPlanWithOptionalId[]>(menuPlansInWeek);

  const [editedMenuPlans, setEditedMenuPlans] = useState(menuPlans);
  const addOrReplaceMenuPlan = useCallback(
    (plan: MenuPlanWithOptionalId) => {
      setEditedMenuPlans((prev) =>
        prev
          .filter((d) => d.date.getDayOfYear() != plan.date.getDayOfYear())
          .concat(plan)
      );
    },
    [setEditedMenuPlans]
  );

  const [commit, loading] = useMutation(createWeekPlan);

  function executeCreateWeekPlanMutation() {
    try {
      const createWeekPlanVariables: createMenuPlanPageMutation$variables = {
        input: {
          fromDate: weekDates[0].toDateOnlyISOString(),
          monday: createMenuPlanForDay(0),
          tuesday: createMenuPlanForDay(1),
          wednesday: createMenuPlanForDay(2),
          thursday: createMenuPlanForDay(3),
          friday: createMenuPlanForDay(4),
        },
      };

      commit({
        variables: createWeekPlanVariables,
        onCompleted: () => {
          toast({
            title: "Ugeplan oprettet",
            status: "success",
          });
        },
        onError: (e) => {
          toast({
            title: "Ugeplan kunne ikke oprettes",
            description:
              "Prøv igen senere og tag fat i Tobias hvis det ikke virker",
            status: "error",
          });
        },
      });

      function createMenuPlanForDay(weekDayNumber: number): CreateDayPlanInput {
        const planForDay = editedMenuPlans.find(
          (d) =>
            d.date.getDayOfYear() == weekDates[weekDayNumber].getDayOfYear()
        );
        if (!planForDay || planForDay.recipes.length === 0) {
          throw weekDates[weekDayNumber];
        }

        return {
          recipes: planForDay.recipes,
          thumbnail: planForDay.thumbnail,
        };
      }
    } catch (e) {
      if (e instanceof Date) {
        toast({
          title: "Udfyld venligst alle dage",
          description: `Du mangler at udfylde ${e.toLocaleDateString()}`,
          status: "error",
        });
      }
    }
  }

  return (
    <Box>
      <TableContainer>
        <Table>
          <Tbody>
            <Tr>
              <Th></Th>
              <Td>
                <HStack>
                  <Stack>
                    <Text>Hovedret</Text>
                    <Text>Fisk</Text>
                    <Text>Kød</Text>
                    <Text>Suppe</Text>
                  </Stack>

                  <Tooltip
                    placement="bottom"
                    label="Vælg gerne 1-2 vegetar/suppedage, 1-2 fiskedage* og 2-3
                  køddage. Vælg dansk produceret magert kød fra fjerkræ, okse,
                  lam eller svin med max 10 % fedt. *Tænk alternativt."
                  >
                    <InfoOutlineIcon />
                  </Tooltip>
                </HStack>
              </Td>
              <Td>
                <HStack>
                  <Stack>
                    <Text>Grove Grøntsager</Text>
                    <Text>Salat</Text>
                  </Stack>

                  <Tooltip
                    placement="bottom"
                    label="Vælg gerne flere økologiske og lokale grove grønsager som kål, rodfrugter, løg, bønner og broccoli, der bages, koges, dampes eller steges i olie. Husk også krydderurterne."
                  >
                    <InfoOutlineIcon />
                  </Tooltip>
                </HStack>
              </Td>
              <Td>
                <HStack>
                  <Stack>
                    <Text>Tilbehør</Text>
                    <Text>Kartofler</Text>
                    <Text>Brød</Text>
                  </Stack>

                  <Tooltip
                    placement="bottom"
                    label="Vælg gerne mere fuldkorn; fuldkornsris, fuldkornspasta og
                  nedsæt mængden af hvedemel og anvend gerne ½ del fuldkornsmel
                  (havre, rug og byg) i brødet."
                  >
                    <InfoOutlineIcon />
                  </Tooltip>
                </HStack>
              </Td>
              <Td>
                <HStack>
                  <Stack>
                    <Text>Sauce</Text>
                    <Text>Mælkeprodukter</Text>
                  </Stack>

                  <Tooltip
                    placement="bottom"
                    label="Vælg gerne magre mælkeprodukter; fedtfattig yoghurt og
                  cremefraiche, mini- og skummemælk. Nedsæt mængden af fløde og
                  smør, og steg i raps- og olivenolie."
                  >
                    <InfoOutlineIcon />
                  </Tooltip>
                </HStack>
              </Td>
              <Td>Thumbnail</Td>
            </Tr>
            {weekDates.map((d) => (
              <DayPlan
                key={d.getDayOfYear()}
                date={d}
                menuPlan={editedMenuPlans.find(
                  (m) => m.date.getDayOfYear() === d.getDayOfYear()
                )}
                onChange={addOrReplaceMenuPlan}
              />
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <HStack justify="end">
        <Button
          type="submit"
          colorScheme="green"
          isLoading={loading}
          onClick={executeCreateWeekPlanMutation}
        >
          Gem madplanen
        </Button>
        <Button onClick={onOpen}>Se Askebakkens madprincipper</Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Askebakkens madprincipper</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Principles />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Luk
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function DayPlan(props: {
  date: Date;
  menuPlan: MenuPlanWithOptionalId | undefined;
  onChange: (plan: MenuPlanWithOptionalId) => void;
}) {
  const recipeByCategory = useMemo(() => {
    return props.menuPlan?.recipes?.toDictionary((r) => r.category);
  }, [props.menuPlan?.recipes]);

  const [recipes, setRecipes] = useState(recipeByCategory);

  useEffect(() => {
    props.onChange({
      id: props.menuPlan?.id,
      date: props.date,
      recipes: Array.from(recipes?.values() ?? []),
    });
  }, [recipes, props.date, props.menuPlan?.id, props.onChange]);

  function addOrUpdateRecipe(
    category: string
  ): ChangeEventHandler<HTMLInputElement> {
    return (e) => {
      setRecipes((prev) => {
        const newMap = new Map(prev);
        newMap.set(category, { name: e.target.value, category: category });
        return newMap;
      });
    };
  }

  return (
    <>
      <Tr key={props.date.getDayOfYear()}>
        <Td>
          <Stack>
            <Text>{props.date.getDanishWeekday()}</Text>
            <Text>{props.date.toLocaleDateString()}</Text>
          </Stack>
        </Td>
        {["main", "veggies", "side", "sauce"].map((cat) => (
          <Td key={cat}>
            <Input
              value={recipes?.get(cat)?.name ?? ""}
              onChange={addOrUpdateRecipe(cat)}
            />
          </Td>
        ))}
        <Td>
          <Input
            value={props.menuPlan?.thumbnail}
            onChange={(evt) =>
              props.onChange({
                id: props.menuPlan?.id,
                date: props.date,
                recipes: Array.from(recipes?.values() ?? []),
                thumbnail: evt.target.value,
              })
            }
          />
        </Td>
      </Tr>

      {props.date.getDay() === 5 && (
        <Tr>
          <Td>Dessert</Td>
          <Td>
            <Input
              value={recipes?.get("dessert")?.name ?? ""}
              onChange={addOrUpdateRecipe("dessert")}
            />
          </Td>
          <Td colSpan={3} />
        </Tr>
      )}
    </>
  );
}

function Principles() {
  return (
    <Stack>
      <Box>
        <Text size="md" fontWeight="bold">
          Askebakkens madprincipper
        </Text>
        <UnorderedList>
          <ListItem>Vi følger de officielle kostråd</ListItem>
          <ListItem>Vi går efter at være bæredygtige</ListItem>
          <ListItem>Vi køber fortrinsvis lokalt/dansk </ListItem>
          <ListItem>Vi vælger fødevarer efter sæson </ListItem>
          <ListItem>
            Vi køber basisvarer, æg, mælkeprodukter og grønt økologisk{" "}
          </ListItem>
          <ListItem>
            Vi tjekker om der er balance mellem madplan og pris: ”Sund fornuft”
          </ListItem>
          <ListItem>
            Vi prøver at undgå madspild, gemmer rester, ”genanvender” og/eller
            fryser ned
          </ListItem>
        </UnorderedList>
      </Box>

      <Box>
        <Text size="md" fontWeight="bold">
          Måleenheder
        </Text>
        <UnorderedList>
          <ListItem>Ris: ¾ -1dl pr. person </ListItem>
          <ListItem>Kartofler: 150-250g pr. person </ListItem>
          <ListItem>Frisk Pasta: 125-150g pr. person </ListItem>
          <ListItem>Tørret pasta: 75-100g pr. person </ListItem>
          <ListItem>Rå kød/fisk: 100-150g pr. person </ListItem>
          <ListItem>
            Stempelkaffe: ca. 45g/1dl til 1L vand - trækker i 4 minutter
          </ListItem>
        </UnorderedList>
      </Box>

      <Box>
        <Text size="md" fontWeight="bold">
          Husk
        </Text>
        <UnorderedList>
          <ListItem>
            Føtex har 25% rabat på alt økologisk den første lørdag hver måned{" "}
          </ListItem>
          <ListItem>Pia køber krydderier og olie/eddike </ListItem>
          <ListItem>Birgitte Bendixen køber grønt/frugt</ListItem>
        </UnorderedList>
      </Box>

      <Box>
        <Text size="md" fontWeight="bold">
          Priser
        </Text>
        <UnorderedList>
          <ListItem>28 kr./person: mandag-torsdag</ListItem>
          <ListItem> 40 kr./person: fredag</ListItem>
        </UnorderedList>
      </Box>
    </Stack>
  );
}
