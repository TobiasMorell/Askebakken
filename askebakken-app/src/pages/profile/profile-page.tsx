import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { graphQLSelector } from "recoil-relay";
import { graphql } from "relay-runtime";
import { RelayEnvironment } from "../../RelayEnvironment";
import { profilePageMeQuery$data } from "../../__generated__/profilePageMeQuery.graphql";
import { LockIcon } from "@chakra-ui/icons";
import { PasswordInput } from "../../components/password-input";
import { KeyboardEventHandler, useRef, useState } from "react";
import { useMutation } from "react-relay";
import { profilePageChangePasswordMutation } from "../../__generated__/profilePageChangePasswordMutation.graphql";

const loggedInUser = graphQLSelector({
  query: graphql`
    query profilePageMeQuery {
      me {
        firstName
        lastName
        username
        houseNumber
        birthDate
      }
    }
  `,
  environment: RelayEnvironment,
  key: "profilePage_me",
  variables: {},
  mapResponse: (r: profilePageMeQuery$data) => r.me,
});

export default function ProfilePage() {
  const me = useRecoilValue(loggedInUser);

  return (
    <Box py={10} px={6}>
      <Stack spacing="8">
        <Box>
          <Center>
            <Stack boxShadow="base" width="lg" p="8" textAlign="center">
              <Box>
                <Avatar
                  name={`${me.firstName} ${me.lastName}`}
                  src=""
                  size="xl"
                />
              </Box>

              <Box>
                <Stack>
                  <Heading size="sm">
                    {me.firstName} {me.lastName}
                  </Heading>
                  <Text color="gray">{me.username}</Text>
                  <Text>{me.houseNumber}</Text>
                  <Text>{new Date(me.birthDate).toLocaleDateString()}</Text>
                </Stack>
              </Box>
            </Stack>
          </Center>
        </Box>

        <UpdatePassword username={me.username} />
      </Stack>
    </Box>
  );
}

function UpdatePassword(props: { username: string }) {
  const toast = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordConfirmRef = useRef<HTMLInputElement>(null);

  const [changePasswordMutation, loading] =
    useMutation<profilePageChangePasswordMutation>(graphql`
      mutation profilePageChangePasswordMutation(
        $oldPassword: String!
        $newPassword: String!
        $username: String!
      ) {
        changePassword(
          input: {
            oldPassword: $oldPassword
            newPassword: $newPassword
            username: $username
          }
        ) {
          success
        }
      }
    `);

  function login() {
    if (!currentPassword) {
      currentPasswordRef.current?.focus();
      return;
    }
    if (!newPassword) {
      newPasswordRef.current?.focus();
      return;
    }
    if (!newPasswordConfirm) {
      newPasswordConfirmRef.current?.focus();
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      toast({
        title: "Kodeordene er ikke ens",
        status: "error",
      });
      newPasswordRef.current?.focus();
      return;
    }

    changePasswordMutation({
      variables: {
        username: props.username,
        oldPassword: currentPassword,
        newPassword: newPassword,
      },
      onCompleted: (data) => {
        toast({
          title: "Kodeord opdateret",
          status: "success",
        });
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirm("");
      },
      onError: (error) => {
        toast({
          title: "Kodeord kunne ikke opdateres",
          description: "Har du indtastet dit nuværende kodeord korrekt?",
          status: "error",
        });
        currentPasswordRef.current?.focus();
      },
    });
  }

  const changePasswordOnEnter: KeyboardEventHandler = (e) => {
    if (e.code === "Enter") {
      login();
    }
  };

  return (
    <Box>
      <Center>
        <Stack width="lg">
          <HStack align="baseline">
            <LockIcon />
            <Heading size="md">Sikkerhed</Heading>
          </HStack>

          <PasswordInput
            placeholder="Nuværende kode"
            value={currentPassword}
            onChange={(v) => setCurrentPassword(v.target.value)}
            ref={currentPasswordRef}
            onKeyDown={changePasswordOnEnter}
          />
          <PasswordInput
            placeholder="Ny kode"
            value={newPassword}
            onChange={(v) => setNewPassword(v.target.value)}
            ref={newPasswordRef}
            onKeyDown={changePasswordOnEnter}
            isInvalid={newPassword !== newPasswordConfirm}
          />
          <PasswordInput
            placeholder="Bekræft ny kode"
            value={newPasswordConfirm}
            onChange={(v) => setNewPasswordConfirm(v.target.value)}
            isInvalid={newPassword !== newPasswordConfirm}
            ref={newPasswordConfirmRef}
            onKeyDown={changePasswordOnEnter}
          />
          <Box textAlign="right">
            <Button
              type="submit"
              colorScheme="green"
              isDisabled={
                currentPassword.length === 0 ||
                newPassword.length === 0 ||
                newPasswordConfirm.length === 0 ||
                newPassword !== newPasswordConfirm ||
                loading
              }
              isLoading={loading}
            >
              Opdater
            </Button>
          </Box>
        </Stack>
      </Center>
    </Box>
  );
}
