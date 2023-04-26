import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Link,
  useToast,
} from "@chakra-ui/react";
import { LoginWrapper } from "./components/login-wrapper";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useMutation } from "react-relay";
import { useRef, useState } from "react";

const loginMutation = graphql`
  mutation forgotPasswordPageForgotPasswordMutation($username: String!) {
    forgotPassword(forgotPasswordInput: { username: $username }) {
      success
    }
  }
`;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [resetPasswordMutation, loading] = useMutation(loginMutation);

  const [email, setEmail] = useState("");
  const [error, setError] = useState<"email">();
  const emailRef = useRef<HTMLInputElement>(null);

  function resetPassword() {
    if (!email) {
      setError("email");
      emailRef.current?.focus();
      return;
    }

    resetPasswordMutation({
      variables: {
        username: email,
      },
      onCompleted: (data) => {
        const toastId = toast({
          status: "success",
          title: "Dit kodeord er blevet nulstillet",
          isClosable: true,
          duration: null,
          description: (
            <Button
              onClick={() => {
                toast.close(toastId);
                navigate("/login");
              }}
            >
              Gå til login
            </Button>
          ),
        });
      },
      onError: (error) => {
        console.error(error);
        toast({
          status: "error",
          title: "Dit kodeord kunne ikke nulstilles",
          description:
            "Prøv igen senere og kontakt en administrator hvis problemet fortsætter",
        });
      },
    });
  }

  return (
    <LoginWrapper>
      <Stack spacing={4}>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            ref={emailRef}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <Stack spacing={10}>
          <Stack
            direction={{ base: "column", sm: "row" }}
            align={"start"}
            justify={"space-between"}
          >
            <RouterLink to="/login">
              <Link color={"blue.400"}>Tilbage til log ind</Link>
            </RouterLink>
          </Stack>
          <Button
            bg={"blue.400"}
            color={"white"}
            _hover={{
              bg: "blue.500",
            }}
            onClick={resetPassword}
            isLoading={loading}
          >
            Nulstil kodeord
          </Button>
        </Stack>
      </Stack>
    </LoginWrapper>
  );
}
