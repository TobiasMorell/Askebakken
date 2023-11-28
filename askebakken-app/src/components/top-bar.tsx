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
  useDisclosure,
  useColorModeValue,
  Spinner,
  MenuItemProps,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { clearAuthToken } from "../state/token";
import { loggedInUser } from "../app-state/logged-in-user";

type TopBarLink = {
  text: string;
  href: string;
  icon?: MenuItemProps["icon"];
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
  const { isOpen, onClose, onToggle, onOpen } = useDisclosure();

  function logOut() {
    clearAuthToken();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <Box bg={useColorModeValue("green.100", "green.900")} px={4} position="sticky" zIndex="sticky">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Menu
            autoSelect={false}
            onClose={onClose}
            isOpen={isOpen}
            onOpen={onOpen}
          >
            <MenuButton
              aria-label={"Open Menu"}
              display={{ md: "none" }}
              onClick={onToggle}
            >
              {isOpen ? <CloseIcon /> : <HamburgerIcon />}
            </MenuButton>
            <Box display={{ md: "none" }}>
              <MenuList>
                {props.menuItems.map((link) => (
                  <HandheldMenuItem link={link} key={link.href} />
                ))}
              </MenuList>
            </Box>
          </Menu>
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
            <Menu autoSelect={false}>
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
                  <MenuItem padding={4}>Profil</MenuItem>
                </RouterLink>
                <RouterLink to="/settings">
                  <MenuItem padding={4}>Indstillinger</MenuItem>
                </RouterLink>
                <MenuItem padding={4} onClick={logOut}>Log ud</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
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

function HandheldMenuItem(props: { link: TopBarLink }) {
  const { link } = props;
  const location = useLocation();
  const selected = location.pathname === link.href;

  return (
    <RouterLink to={link.href}>
      <MenuItem bg={selected ? "gray.200" : undefined} icon={link.icon} padding={4}>
        {link.text}
      </MenuItem>
    </RouterLink>
  );
}
