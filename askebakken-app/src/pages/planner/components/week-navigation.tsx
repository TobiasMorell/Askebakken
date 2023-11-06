import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Text } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { FormatTime } from "../../../components/format-time";
import { startDateState, endDateState } from "../menu-planner-state";

export function WeekNavigation() {
  const [startDate, setStartDate] = useRecoilState(startDateState);
  const [endDate, setEndDate] = useRecoilState(endDateState);

  function nextWeek() {
    setStartDate(startDate.addDays(7));
    setEndDate(endDate.addDays(7));
    window.scrollTo(0, 0);
  }

  function previousWeek() {
    setStartDate(startDate.addDays(-7));
    setEndDate(endDate.addDays(-7));
    window.scrollTo(0, 0);
  }

  return (
    <HStack spacing={4}>
      <IconButton
        onClick={previousWeek}
        icon={<ChevronLeftIcon />}
        aria-label="Forrige uge"
      />
      <HStack spacing={2}>
        <FormatTime value={startDate} />
        <Text>-</Text>
        <FormatTime value={endDate} />
      </HStack>
      <IconButton
        onClick={nextWeek}
        icon={<ChevronRightIcon />}
        aria-label="Næste uge"
      />
    </HStack>
  );
}
