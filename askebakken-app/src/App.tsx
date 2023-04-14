import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import chakraTheme from '@chakra-ui/theme';
import { extendBaseTheme, ChakraBaseProvider } from '@chakra-ui/react';

const { Button, Input } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
    Input,
  },
});

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraBaseProvider>
  );
}

export default App;
