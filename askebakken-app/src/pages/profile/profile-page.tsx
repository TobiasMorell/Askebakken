import { InfoIcon } from "@chakra-ui/icons";
import { Box, Heading, Text } from "@chakra-ui/react";

export default function ProfilePage() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <InfoIcon boxSize={"50px"} color={"blue.500"} />
      <Heading as="h2" size="xl" mt={6} mb={2}>
        Kommer snart!
      </Heading>
      <Text color={"gray.500"}>
        Profil-siden er ikke klar endnu. Den kommer snart, så vær venligst
        tålmodig.
      </Text>
    </Box>
  );
}
