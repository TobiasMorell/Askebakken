import {
  Flex,
  useColorModeValue,
  Stack,
  Heading,
  Box,
  Image,
  Center,
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export function LoginWrapper(props: PropsWithChildren<{}>) {
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>
            Log ind på Askebakkens beboerportal
          </Heading>
        </Stack>

        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Center>
            <Image src="/asketrae.png" height="256px" />
          </Center>

          <Box>{props.children}</Box>
        </Box>
      </Stack>
    </Flex>
  );
}
