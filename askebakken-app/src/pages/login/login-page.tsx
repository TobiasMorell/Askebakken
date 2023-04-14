import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
  Link,
  Stack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { LoginWrapper } from './components/login-wrapper';
import { Link as RouterLink } from 'react-router-dom';
import { graphql, useMutation } from 'react-relay';

export function LoginPage() {
  const [login, loading] = useMutation(graphql`
    mutation Authenticate($username: String!, $password: String!) {
      authenticate(
        authenticateInput: { username: $username, password: $password }
      )
    }
  `);

  return (
    <LoginWrapper>
      <LoginContent
        login={(username, password) => {
          login({
            variables: { username, password },
            onCompleted: token => {},
          });
        }}
      />
    </LoginWrapper>
  );
}

function LoginContent(props: {
  login: (email: string, password: string) => void;
}) {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<'email' | 'password'>();

  function login() {
    if (!email) {
      setError('email');
      return;
    }
    if (!password) {
      setError('password');
      return;
    }

    props.login(email, password);
  }

  return (
    <Stack spacing={4}>
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          onChange={v => setEmail(v.target.value)}
          value={email}
          placeholder="Email"
          errorBorderColor="red.300"
          isInvalid={error === 'email'}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Kodeord</FormLabel>
        <PasswordInput
          onChange={v => setPassword(v.target.value)}
          value={password}
          placeholder="Kodeord"
          pr="4.5rem"
          errorBorderColor="red.300"
          isInvalid={error === 'password'}
        />
      </FormControl>
      <Stack spacing={10}>
        <Stack
          direction={{ base: 'column', sm: 'row' }}
          align={'start'}
          justify={'space-between'}
        >
          <Checkbox>Husk mig</Checkbox>
          <RouterLink to="/forgot-password">
            <Link color={'blue.400'}>Glemt kodeord?</Link>
          </RouterLink>
        </Stack>
        <Button
          bg={'blue.400'}
          color={'white'}
          _hover={{
            bg: 'blue.500',
          }}
          onClick={login}
        >
          Log ind
        </Button>
      </Stack>
    </Stack>
  );
}

function PasswordInput(props: Omit<InputProps, 'type'>) {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);

  return (
    <InputGroup size="md">
      <Input type={show ? 'text' : 'password'} {...props} />
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={toggle}>
          {show ? 'Vis' : 'Skjul'}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}
