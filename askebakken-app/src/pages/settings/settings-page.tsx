import {
  Box,
  Center,
  Select,
  Stack,
  Text,
  Image,
  Icon,
  HStack,
  GridItem,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { devicePreferences } from "../../app-state/device-preferences";
import { InfoOutlineIcon } from "@chakra-ui/icons";

export default function SettingsPage() {
  const [devicePrefs, setDevicePreferences] = useRecoilState(devicePreferences);

  return (
    <Box py={10} px={6}>
      <Stack spacing="8">
        <Box>
          <Text>Visning</Text>
          <Center>
            <Select
              onChange={(evt) =>
                setDevicePreferences({
                  ...devicePrefs,
                  appDisplayMode: evt.target.value as any,
                })
              }
              value={devicePrefs.appDisplayMode}
            >
              <option value="SYSTEM">Fælleshus</option>
              <option value="RESIDENT">Personlig</option>
            </Select>
          </Center>
        </Box>
        <Box>
          <Text>Layout</Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <GridItem
              padding={8}
              style={{
                transition: "box-shadow 0.3s",
                cursor: "pointer",
              }}
              _hover={{ boxShadow: "md" }}
              borderColor={devicePrefs.layout === "MODERN" ? "black" : "none"}
              borderWidth="1px"
              onClick={() =>
                setDevicePreferences({ ...devicePrefs, layout: "MODERN" })
              }
            >
              <Stack spacing={8} width="full">
                <Center>
                  <Box boxShadow="md">
                    <Image height="300px" src="/card.png" />
                  </Box>
                </Center>

                <HStack spacing={4}>
                  <Box>
                    <InfoOutlineIcon />
                  </Box>
                  <Box>
                    <Text>
                      Kort-visning viser madplanerne i enkeltstående kort. Det
                      er den visning der fungerer bedst på små enheder (f.eks.
                      mobil og tablet).
                    </Text>
                  </Box>
                </HStack>
              </Stack>
            </GridItem>
            <GridItem
              padding={8}
              style={{
                transition: "box-shadow 0.3s",
                cursor: "pointer",
              }}
              _hover={{ boxShadow: "md" }}
              borderColor={
                devicePrefs.layout === "CLASSIC" ? "black" : undefined
              }
              borderWidth="1px"
              onClick={() =>
                setDevicePreferences({ ...devicePrefs, layout: "CLASSIC" })
              }
            >
              <Stack spacing={8} width="full">
                <Center>
                  <Box boxShadow="md">
                    <Image height="300px" src="/table.png" />
                  </Box>
                </Center>

                <HStack spacing={4}>
                  <Box>
                    <InfoOutlineIcon />
                  </Box>
                  <Box>
                    <Text>
                      Tabel-visning viser madplanerne i en tabel der ligner den
                      papir-baserede version som plejede at hænge i fælleshuset.
                      Den fungerer fint på store computer skærme, men er lidt
                      for stor til at være på en tablet- eller telefonskærm.
                    </Text>
                  </Box>
                </HStack>
              </Stack>
            </GridItem>
          </SimpleGrid>
        </Box>
      </Stack>
    </Box>
  );
}
