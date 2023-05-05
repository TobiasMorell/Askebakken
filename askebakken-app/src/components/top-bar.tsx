import { ReactNode, Suspense } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  Image,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Spinner,
  Select,
  MenuGroup,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, CheckIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { graphQLSelector } from "recoil-relay";
import { RelayEnvironment } from "../RelayEnvironment";
import { graphql } from "react-relay";
import { topBarMeQuery$data } from "../__generated__/topBarMeQuery.graphql";
import { useRecoilState, useRecoilValue } from "recoil";
import { clearAuthToken } from "../state/token";
import {
  appDisplayModeState,
  toAppDisplayMode,
} from "../app-state/app-display-mode";

const loggedInUser = graphQLSelector({
  query: graphql`
    query topBarMeQuery {
      me {
        firstName
        lastName
      }
    }
  `,
  environment: RelayEnvironment,
  key: "me",
  variables: {},
  mapResponse: (r: topBarMeQuery$data) => r.me,
});

type TopBarLink = {
  text: string;
  href: string;
};

function NavLink({ children, to }: { children: ReactNode; to: string }) {
  return (
    <RouterLink to={to}>
      <Link
        padding={4}
        rounded={"md"}
        as="span"
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("green.200", "green.700"),
        }}
      >
        {children}
      </Link>
    </RouterLink>
  );
}

export default function TopBar(props: { menuItems: TopBarLink[] }) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [appDisplayMode, setAppDisplayMode] =
    useRecoilState(appDisplayModeState);

  function logOut() {
    clearAuthToken();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <Box bg={useColorModeValue("green.100", "green.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box>
              <Image height="48px" src="/asketrae.png" />
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {props.menuItems.map((link) => (
                <NavLink key={link.href} to={link.href}>
                  {link.text}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Suspense fallback={<Spinner size="md" />}>
                  <UserAvatar />
                </Suspense>
              </MenuButton>
              <MenuList>
                <RouterLink to="/profile">
                  <MenuItem>Profil</MenuItem>
                </RouterLink>
                <MenuGroup title="App layout">
                  <MenuItem
                    onClick={() => setAppDisplayMode("RESIDENT")}
                    icon={
                      appDisplayMode === "RESIDENT" ? <CheckIcon /> : undefined
                    }
                  >
                    Personlig
                  </MenuItem>
                  <MenuItem
                    onClick={() => setAppDisplayMode("SYSTEM")}
                    icon={
                      appDisplayMode === "SYSTEM" ? <CheckIcon /> : undefined
                    }
                  >
                    Fælleshus
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuItem onClick={logOut}>Log ud</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {props.menuItems.map((link) => (
                <NavLink key={link.href} to={link.href}>
                  {link.text}
                </NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}

function UserAvatar() {
  const me = useRecoilValue(loggedInUser);

  return (
    <Avatar size={"md"} name={`${me.firstName} ${me.lastName}`} src={""} />
  );
}
