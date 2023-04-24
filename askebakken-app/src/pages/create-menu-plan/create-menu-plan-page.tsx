import { InfoOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import { useMemo } from "react";
import { graphQLSelector } from "recoil-relay";
import { RelayEnvironment } from "../../RelayEnvironment";
import { createMenuPlanPageMenuPlansBetweenQuery$data } from "../../__generated__/createMenuPlanPageMenuPlansBetweenQuery.graphql";
import { atom, selector, useRecoilState, useRecoilValueLoadable } from "recoil";
import { graphql } from "react-relay";
import { toDictionary } from "../../utils/array-utils";

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
          recipes {
            name
            category
          }
        }
      }
    }
  `,
  environment: RelayEnvironment,
  variables: ({ get }) => ({
    fromDate: get(startDate),
    toDate: get(endDate),
  }),
  mapResponse: (r: createMenuPlanPageMenuPlansBetweenQuery$data): MenuPlan[] =>
    r.menuPlan?.nodes?.map((n) => ({ ...n, date: new Date(n.date) })) ?? [],
});

type MenuPlan = Readonly<{
  date: Date;
  id: string;
  recipes: ReadonlyArray<{
    category: string;
    name: string;
  }>;
}>;

export default function CreateMenuPlanPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [week, setWeek] = useRecoilState(selectedWeek);
  const [year, setYear] = useRecoilState(selectedYear);

  const weekDates = useMemo(() => getWeekDates(week, year), [week, year]);

  const menuPlans = useRecoilValueLoadable(menuPlansInWeek);

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
            {Array.from({ length: 52 }, (_, i) => i + 1).map((i) => (
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
            {Array.from(
              { length: 10 },
              (_, i) => i + new Date().getFullYear() - 2
            ).map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </Select>
        </HStack>

        <TableContainer>
          <Table>
            <Tbody>
              <Tr>
                <Th></Th>
                <Td>
                  <HStack>
                    <Text>Hovedret/fisk/kød/suppe</Text>
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
                    <Text>Grove grøntsager/salat</Text>
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
                    <Text>Tilbehør/kartofler/brød</Text>
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
                    <Text>Sauce/Mælkeprodukter</Text>
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
              </Tr>
              {weekDates.map((d) => (
                <DayPlan
                  key={d.getDayOfYear()}
                  date={d}
                  menuPlan={menuPlans
                    .valueMaybe()
                    ?.find((m) => m.date.getDayOfYear() === d.getDayOfYear())}
                />
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        <HStack justify="end">
          <Button onClick={onOpen}>Se Askebakkens madprincipper</Button>
        </HStack>
      </Stack>

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

function DayPlan(props: { date: Date; menuPlan: MenuPlan | undefined }) {
  const recipeByCategory = useMemo(() => {
    return toDictionary(props.menuPlan?.recipes ?? [], (r) => r.category);
  }, [props.menuPlan?.recipes]);

  return (
    <Tr key={props.date.getDayOfYear()}>
      <Td>
        <Stack>
          <Text>{props.date.getDanishWeekday()}</Text>
          <Text>{props.date.toLocaleDateString()}</Text>
        </Stack>
      </Td>
      <Td>
        <Input value={recipeByCategory.get("main")?.name} />
      </Td>
      <Td>
        <Input value={recipeByCategory.get("veggies")?.name} />
      </Td>
      <Td>
        <Input value={recipeByCategory.get("side")?.name} />
      </Td>
      <Td>
        <Input value={recipeByCategory.get("sauce")?.name} />
      </Td>
    </Tr>
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

function getWeekDates(weekNumber: number, year: number): Date[] {
  const monday = new Date(year, 0, 2 + (weekNumber - 1) * 7);

  return Array.from({ length: 5 }, (_, i) => i).map(
    (i) => new Date(monday.getTime() + i * 24 * 60 * 60 * 1000)
  );
}
