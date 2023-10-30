import {
  Center,
  SimpleGrid,
  GridItem,
  Card,
  CardBody,
  Stack,
  Heading,
  Flex,
  CardFooter,
  ButtonGroup,
  Avatar,
  Text,
  Image,
  Box,
  AspectRatio,
  Wrap,
  WrapItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverHeader,
  useToast,
} from "@chakra-ui/react";
import { ToggleAttendanceButton } from "../../login/components/toggle-attendance-button";
import { Resident } from "../types";
import { PlannerPageLayoutProviderProps } from "./planner-page-layout";
import { useRecoilValue } from "recoil";
import { loggedInUser } from "../../../app-state/logged-in-user";
import { ChefHatIcon } from "../../../components/chef-hat-icon";
import { ToggleCookingCardButton } from "../components/join-cooking-card-button";

import style from "./card-planner.module.css";
import { CSSProperties } from "react";

export function CardBasedPlanner(props: PlannerPageLayoutProviderProps) {
  const toast = useToast();
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
          <GridItem key={`name-${d.date.getDayOfYear()}`}>
            <Card variant="elevated">
              <CardBody>
                <Stack mt="6">
                  <Heading size="sm">
                    {d.recipes
                      .filter((r) => r.name.length > 0)
                      .map((r) => r.name)
                      .join(" | ")}
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
                <Stack spacing={4}>
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

                  <Box>
                    <Text>Tilmeldte:</Text>
                    <Wrap>
                      {d.participants
                        .filter((g) => !!g)
                        .map((g) => (
                          <WrapItem key={g!.id} alignItems="end">
                            <CardAttendanceAvatar
                              resident={props.residentById?.get(g!.id)}
                              decoration={
                                d.chefs.find((c) => c.id === g.id) ? (
                                  <ChefHatIcon />
                                ) : undefined
                              }
                            />
                          </WrapItem>
                        ))}
                    </Wrap>
                  </Box>
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
                  <ToggleCookingCardButton
                    date={d.date}
                    userId={me.id}
                    isChef={d.chefs.find((c) => c.id === me.id) != null}
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

function CardAttendanceAvatar(props: {
  resident?: Resident;
  decoration?: React.ReactNode;
}) {
  // Generate random number between 0.3 and 0.7
  const popInAnimationDuration = Math.random() * 0.4 + 0.3;

  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Box position="relative" marginTop={props.decoration ? "4" : undefined}>
          <div
            style={
              {
                "--animation-duration": "0.5s",
                "--animation-delay": `${popInAnimationDuration}s`,
              } as CSSProperties
            }
            className={[style.avatarDecoration, style.jingle].join(" ")}
          >
            {props.decoration}
          </div>
          <Avatar
            size="sm"
            name={`${props.resident?.firstName} ${props.resident?.lastName}`}
            className={style.popIn}
            style={
              {
                "--animation-duration": `${popInAnimationDuration}s`,
              } as CSSProperties
            }
          />
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverHeader>
          {props.resident?.firstName} {props.resident?.lastName}
        </PopoverHeader>
        <PopoverBody>Uldalsvej {props.resident?.houseNumber}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
