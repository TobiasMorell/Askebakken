import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  AbsoluteCenter,
  Box,
  Button,
  Center,
  ChakraProvider,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { LoginPage } from "./pages/login/login-page";
import { Suspense, useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import "./style.css";

import "./__prototype__/Date";
import "./__prototype__/Array";
import { clearAuthToken, getAuthToken } from "./state/token";
import { RecoilRoot } from "recoil";
import TopBar from "./components/top-bar";
import React from "react";

const PlannerPage = React.lazy(() => import("./pages/planner/planner-page"));

const NotFoundPage = React.lazy(
  () => import("./pages/not-found/not-found-page")
);
const ForgotPasswordPage = React.lazy(
  () => import("./pages/login/forgot-password-page")
);
const CreateMenuPlanPage = React.lazy(
  () => import("./pages/create-menu-plan/create-menu-plan-page")
);
const FoodTeamPage = React.lazy(
  () => import("./pages/food-team/food-team-page")
);
const ProfilePage = React.lazy(() => import("./pages/profile/profile-page"));
const SettingsPage = React.lazy(() => import("./pages/settings/settings-page"));

const router = createBrowserRouter([
  {
    path: "",
    Component: Layout,
    children: [
      { index: true, Component: PlannerPage },
      { path: "add-plan", Component: CreateMenuPlanPage },
      { path: "food-team", Component: FoodTeamPage },
      { path: "profile", Component: ProfilePage },
      { path: "settings", Component: SettingsPage },
    ],
  },
  {
    path: "login",
    Component: LoginPage,
  },
  {
    path: "forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

function App() {
  return (
    <RecoilRoot key={getAuthToken()}>
      <ChakraProvider
        toastOptions={{ defaultOptions: { position: "top-right" } }}
      >
        <Suspense
          fallback={
            <div className="page-loader">
              <AbsoluteCenter>
                <Spinner size="xl" />
              </AbsoluteCenter>
            </div>
          }
        >
          <Box>
            <RouterProvider router={router} />
          </Box>
        </Suspense>
      </ChakraProvider>
    </RecoilRoot>
  );
}

function Layout() {
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Box>
        <TopBar
          menuItems={[
            {
              text: "Tilmelding",
              href: "/",
            },
            {
              text: "Madhold",
              href: "/food-team",
            },
            {
              text: "Opret Madplan",
              href: "/add-plan",
            },
          ]}
        />

        <Outlet />
      </Box>
    </ErrorBoundary>
  );
}

function Fallback(props: FallbackProps) {
  const [hasNavigated, setHasNavigated] = React.useState(false);

  const reload = () => {
    window.location.reload();
  };

  useEffect(() => {
    const errors:
      | [{ message: string; extensions: { code: string } }]
      | undefined = props.error.source?.errors;

    if (errors?.some((e) => e.extensions.code === "AUTH_NOT_AUTHORIZED")) {
      clearAuthToken();
      if (!hasNavigated) {
        setHasNavigated(true);
        // Hard refresh window to clear relay cache
        window.location.replace("/login");
      }
    }
  }, [props?.error, hasNavigated, setHasNavigated]);

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      console.error(props.error);
    }
  }, [props.error]);

  if (hasNavigated) {
    return null;
  }

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          spacing="4"
        >
          <Stack>
            <Heading fontSize={"xl"}>Der skete en fejl</Heading>
          </Stack>

          <Box>
            <Text color="red">{props.error.message}</Text>
          </Box>

          <Box>
            <Text>
              Hvis denne fejl fortsætter, så kontakt venligst Tobias og bed ham
              om at fikse den!
            </Text>
          </Box>

          <Center>
            <Button onClick={reload} colorScheme="green">
              Genindlæs
            </Button>
          </Center>
        </Stack>
      </Stack>
    </Flex>
  );
}

export default App;
