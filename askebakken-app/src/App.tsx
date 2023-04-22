import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { AbsoluteCenter, ChakraProvider, Spinner } from "@chakra-ui/react";
import { ForgotPasswordPage } from "./pages/login/forgot-password-page";
import { LoginPage } from "./pages/login/login-page";
import { PlannerPage } from "./pages/planner/planner-page";
import { Suspense, useEffect } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import "./style.css";

import "./__prototype__/Date";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ErrorBoundary FallbackComponent={Fallback}>
        <PlannerPage />
      </ErrorBoundary>
    ),
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "forgot-password",
    element: <ForgotPasswordPage />,
  },
]);

function App() {
  return (
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
        <RouterProvider router={router} />
      </Suspense>
    </ChakraProvider>
  );
}

function Fallback(props: FallbackProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const errors:
      | [{ message: string; extensions: { code: string } }]
      | undefined = props.error.source?.errors;

    if (errors?.some((e) => e.extensions.code === "AUTH_NOT_AUTHORIZED")) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
      props.resetErrorBoundary();
    }
  }, [props?.error, navigate, props?.resetErrorBoundary]);

  useEffect(() => {
    if (window.location.hostname === "localhost") {
      console.error(props.error);
    }
  }, [props.error]);

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{props.error.message}</pre>
    </div>
  );
}

export default App;
