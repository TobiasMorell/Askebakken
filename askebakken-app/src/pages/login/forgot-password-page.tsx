import {
  Stack,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Link,
} from '@chakra-ui/react';
import { LoginWrapper } from './components/login-wrapper';
import { Link as RouterLink } from 'react-router-dom';

export function ForgotPasswordPage() {
  return (
    <LoginWrapper>
      <Stack spacing={4}>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" />
        </FormControl>

        <Stack spacing={10}>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            align={'start'}
            justify={'space-between'}
          >
            <RouterLink to="/login">
              <Link color={'blue.400'}>Tilbage til log ind</Link>
            </RouterLink>
          </Stack>
          <Button
            bg={'blue.400'}
            color={'white'}
            _hover={{
              bg: 'blue.500',
            }}
          >
            Nulstil kodeord
          </Button>
        </Stack>
      </Stack>
    </LoginWrapper>
  );
}
