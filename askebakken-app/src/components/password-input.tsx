import {
  Input,
  InputRightElement,
  Button,
  InputProps,
  InputGroup,
} from "@chakra-ui/react";
import { forwardRef, useState } from "react";

export const PasswordInput = forwardRef(function (
  props: Omit<InputProps, "type" | "pr" | "errorBorderColor">,
  ref
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup size="md">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Kodeord"
        pr="4.5rem"
        errorBorderColor="red.300"
        ref={ref}
        {...props}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          onClick={() => setShowPassword((s) => !s)}
        >
          {showPassword ? "Skjul" : "Vis"}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
});
