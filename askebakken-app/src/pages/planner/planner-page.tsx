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
  NumberInput,
  NumberInputField,
  IconButton,
} from '@chakra-ui/react';
import style from './planner-page.module.css';
import { ChevronRightIcon, ChevronLeftIcon } from '@chakra-ui/icons';

const participantCategories = ['Voksen', 'Voksen gæst', 'Barn gæst'];
const houses = [
  '2A',
  '2B',
  '2D',
  '2F',
  '2G',
  '4A',
  '6A',
  '6B',
  '6C',
  '6D',
  '6E',
  '6F',
  '6G',
  '6H',
  '6K',
];

export function PlannerPage() {
  return <PlannerTable />;
}

function PlannerTable() {
  return (
    <TableContainer>
      <Table className={style.plannerTable} size="sm">
        <Thead>
          <Tr>
            <Th>Dato</Th>
            <Th>Mandag</Th>
            <Th>Tirsdag</Th>
            <Th>Onsdag</Th>
            <Th>Torsdag</Th>
            <Th>Fredag</Th>
          </Tr>
          <Tr>
            <Th />
            <Th>
              <PlannerTableEntry entries={participantCategories} />
            </Th>
            <Th>
              <PlannerTableEntry entries={participantCategories} />
            </Th>
            <Th>
              <PlannerTableEntry entries={participantCategories} />
            </Th>
            <Th>
              <PlannerTableEntry entries={participantCategories} />
            </Th>
            <Th>
              <PlannerTableEntry entries={participantCategories} />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {houses.map(house => (
            <Tr>
              <Td>{house}</Td>
              <Td>
                <PlannerTableEntry
                  entries={[
                    <Box>
                      <IconButton
                        aria-label="Færre deltagere"
                        icon={<ChevronLeftIcon />}
                      />
                      <NumberInput defaultValue={0}>
                        <NumberInputField />
                      </NumberInput>
                      <IconButton
                        aria-label="Flere deltagere"
                        icon={<ChevronRightIcon />}
                      />
                    </Box>,
                    0,
                    0,
                  ]}
                />
              </Td>
              <Td>
                <PlannerTableEntry entries={[2, 0, 0]} />
              </Td>
              <Td>
                <PlannerTableEntry entries={[2, 0, 0]} />
              </Td>
              <Td>
                <PlannerTableEntry entries={[2, 0, 0]} />
              </Td>
              <Td>
                <PlannerTableEntry entries={[2, 0, 0]} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

function PlannerTableEntry(props: { entries: React.ReactNode[] }) {
  return (
    <Flex>
      {props.entries.map((e, idx) => (
        <Box
          borderLeft={idx > 0 ? '1px' : undefined}
          borderRight={idx < props.entries.length - 1 ? '1px' : undefined}
          borderColor="black"
          padding="4px"
          width="120px"
        >
          {e}
        </Box>
      ))}
    </Flex>
  );
}
