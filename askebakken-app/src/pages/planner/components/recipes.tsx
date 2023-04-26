import { Stack, Center, Text } from "@chakra-ui/react";
import { Recipe } from "../types";

export function Recipes(props: { recipes: readonly Recipe[] }) {
  return (
    <Stack padding={4}>
      {props.recipes?.map((r, idx) => (
        <Center key={r.id}>
          <Text>{r.name}</Text>
        </Center>
      ))}
    </Stack>
  );
}
