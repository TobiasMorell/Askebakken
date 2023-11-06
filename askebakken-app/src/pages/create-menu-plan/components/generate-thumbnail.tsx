import { Search2Icon } from "@chakra-ui/icons";
import {
  Button,
  GridItem,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { graphql } from "relay-runtime";
import { generateThumbnail_GenerateThumbnailsMutation } from "../../../__generated__/generateThumbnail_GenerateThumbnailsMutation.graphql";
import { useMutation } from "react-relay";
import { useState } from "react";

const SERVER_BASE_PATH = import.meta.env.VITE_GRAPHQL_ENDPOINT.replace(
  "/graphql",
  ""
);

const generateThumbnailMutation = graphql`
  mutation generateThumbnail_GenerateThumbnailsMutation(
    $menuPlanId: UUID!
    $numberOfThumbnails: Int!
    $thumbnailSize: Int!
  ) {
    generateThumbnail(
      request: {
        menuPlanId: $menuPlanId
        numberOfThumbnails: $numberOfThumbnails
        thumbnailSize: $thumbnailSize
      }
    ) {
      thumbnailUrls
    }
  }
`;

export function GenerateThumbnail(props: { menuPlanId: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [thumbnailUrls, setThumbnailUrls] = useState<readonly string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>();

  const [generate, loading] =
    useMutation<generateThumbnail_GenerateThumbnailsMutation>(
      generateThumbnailMutation
    );

  function generateImagesAndOpenModal() {
    generate({
      variables: {
        menuPlanId: props.menuPlanId,
        numberOfThumbnails: 1,
        thumbnailSize: 512,
      },
      onCompleted: (result) => {
        console.log(result);
        setThumbnailUrls(result.generateThumbnail.thumbnailUrls);
        onOpen();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  }

  function onConfirm() {
    if (selectedImage) {
      console.log(`Selected image: ${selectedImage}`);
    }
    onClose();
  }

  function onCancel() {
    setSelectedImage(undefined);
    onClose();
  }

  return (
    <>
      <IconButton
        isLoading={loading}
        icon={<Search2Icon />}
        aria-label="Generate thumbnail"
        onClick={generateImagesAndOpenModal}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Vælg et billede til madplanen</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SimpleGrid>
              {thumbnailUrls.map((url) => (
                <GridItem key={url}>
                  <Image
                    src={`${SERVER_BASE_PATH}/${url}`}
                    border={
                      url === selectedImage ? "2px solid black" : undefined
                    }
                    _hover={{
                      border: !selectedImage ? "1px solid black" : undefined,
                    }}
                    onClick={() => setSelectedImage(url)}
                  />
                </GridItem>
              ))}
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onConfirm}>
              Bekræft
            </Button>
            <Button variant="ghost" onClick={onCancel}>
              Annuller
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
