import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";
import { LoginWrapper } from "./components/login-wrapper";
import { Link, useNavigate } from "react-router-dom";
import { graphql, useMutation } from "react-relay/hooks";
import { loginPageAuthenticateMutation } from "../../__generated__/loginPageAuthenticateMutation.graphql";
import { getAuthToken, setAuthToken } from "../../state/token";
import { PasswordInput } from "../../components/password-input";

const loginMutation = graphql`
  mutation loginPageAuthenticateMutation(
    $username: String!
    $password: String!
  ) {
    authenticate(
      authenticateInput: { username: $username, password: $password }
    ) {
      token
    }
  }
`;

export function LoginPage(props: {}) {
  const [graphQLLoginMutation, loading] =
    useMutation<loginPageAuthenticateMutation>(loginMutation);
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<"email" | "password">();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (getAuthToken()) {
      navigate("/", { replace: true });
    }
  }, []);

  function login() {
    setError(undefined);
    if (!email) {
      setError("email");
      emailRef.current?.focus();
      return;
    }
    if (!password) {
      setError("password");
      passwordRef.current?.focus();
      return;
    }

    graphQLLoginMutation({
      variables: {
        username: email,
        password: password,
      },
      onCompleted: (data) => {
        const token = data.authenticate.token;
        setAuthToken(token);
        navigate("/", { replace: true });
      },
      onError: (error) => {
        toast({
          title: "Forkert email eller kodeord",
          status: "error",
        });
      },
    });
  }

  const loginOnEnter: KeyboardEventHandler = (e) => {
    if (e.code === "Enter") {
      login();
    }
  };

  return (
    <LoginWrapper>
      <Stack spacing={4}>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            ref={emailRef}
            onChange={(v) => setEmail(v.target.value)}
            value={email}
            placeholder="Email"
            errorBorderColor="red.300"
            isInvalid={error === "email"}
            onKeyUp={loginOnEnter}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Kodeord</FormLabel>

          <PasswordInput
            value={password}
            onChange={(v) => setPassword(v.target.value)}
            ref={passwordRef}
            onKeyUp={loginOnEnter}
            isInvalid={error === "password"}
          />
        </FormControl>
        <Stack spacing={10}>
          <Stack
            direction={{ base: "column", sm: "row" }}
            align={"start"}
            justify={"end"}
          >
            <Link to="/forgot-password">
              <Box color={"blue.400"}>Glemt kodeord?</Box>
            </Link>
          </Stack>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={login}
            isLoading={loading}
          >
            Log ind
          </Button>
        </Stack>
      </Stack>
    </LoginWrapper>
  );
}
