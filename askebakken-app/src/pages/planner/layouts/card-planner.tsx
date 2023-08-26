import {
  Center,
  SimpleGrid,
  GridItem,
  Card,
  CardBody,
  Stack,
  Heading,
  Flex,
  Divider,
  CardFooter,
  ButtonGroup,
  Avatar,
  Text,
  Image,
  Box,
  AspectRatio,
} from "@chakra-ui/react";
import { ToggleAttendanceButton } from "../../login/components/toggle-attendance-button";
import { Resident } from "../types";
import { PlannerPageLayoutProviderProps } from "./planner-page-layout";
import { graphql } from "react-relay";
import { graphQLSelector } from "recoil-relay";
import { RelayEnvironment } from "../../../RelayEnvironment";
import { useRecoilValue } from "recoil";
import { cardPlannerMeQuery$data } from "../../../__generated__/cardPlannerMeQuery.graphql";

const loggedInUser = graphQLSelector({
  query: graphql`
    query cardPlannerMeQuery {
      me {
        id
        firstName
        lastName
      }
    }
  `,
  environment: RelayEnvironment,
  key: "card-planner-me",
  variables: {},
  mapResponse: (r: cardPlannerMeQuery$data) => r.me,
});

export function CardBasedPlanner(props: PlannerPageLayoutProviderProps) {
  const me = useRecoilValue(loggedInUser);

  if (props.menuPlans.length === 0) {
    return (
      <Center padding="8">
        <Text color="gray.400">Der er ikke planlagt nogen dage endnu</Text>
      </Center>
    );
  }

  return (
    <Box padding={{ base: 4, md: 8, lg: 16 }}>
      <SimpleGrid spacing={10} columns={{ sm: 1, md: 2, xl: 4 }}>
        {props.menuPlans.map((d) => (
          <GridItem>
            <Card key={`name-${d.date.getDayOfYear()}`} variant="elevated">
              <CardBody>
                <Stack mt="6">
                  <Heading size="sm">
                    {d.recipes.map((r) => r.name).join(" | ")}
                  </Heading>
                  <Text color="gray.400">{`${d.date.getDanishWeekday()}, ${d.date.toLocaleDateString()}`}</Text>
                </Stack>
              </CardBody>
              <AspectRatio ratio={1}>
                <Image
                  src={d.thumbnail ?? ""}
                  alt="Der mangler et billede her"
                />
              </AspectRatio>
              <CardBody>
                <SimpleGrid gap="8" columns={2}>
                  <GridItem>
                    <Flex gap="2">
                      <Box>Voksne:</Box>
                      <Box>
                        {d.participants.filter((p) =>
                          p ? !props.residentById?.get(p.id)?.child : false
                        )?.length ?? 0}
                      </Box>
                    </Flex>
                  </GridItem>
                  <GridItem>
                    <Flex gap="2">
                      <Box>Børn:</Box>
                      <Box>
                        {d.participants.filter((p) =>
                          p ? props.residentById?.get(p.id)?.child : false
                        )?.length ?? 0}
                      </Box>
                    </Flex>
                  </GridItem>
                </SimpleGrid>

                <Stack direction="row">
                  {d.participants
                    .filter((g) => !!g)
                    .map((g) => (
                      <CardAttendanceAvatar
                        key={g!.id}
                        resident={props.residentById?.get(g!.id)}
                      />
                    ))}
                </Stack>
              </CardBody>
              <CardFooter>
                <ButtonGroup spacing="2" justifyItems="end">
                  <ToggleAttendanceButton
                    participantIds={
                      d.participants
                        .map((p) => p?.id)
                        .filter((p) => !!p)
                        .map((p) => p!) ?? []
                    }
                    userId={me.id}
                    menuPlanId={d.id}
                  />
                </ButtonGroup>
              </CardFooter>
            </Card>
          </GridItem>
        ))}
      </SimpleGrid>
    </Box>
  );
}

function CardAttendanceAvatar(props: { resident?: Resident }) {
  return (
    <Avatar
      size="sm"
      name={`${props.resident?.firstName} ${props.resident?.lastName}`}
    />
  );
}
