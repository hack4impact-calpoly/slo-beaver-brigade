import { AddIcon } from "@chakra-ui/icons";
import { Text,  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Box, IconButton } from "@chakra-ui/react";
import { getAllImagesS3 } from "app/actions/imageactions";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import style from "@styles/admin/eventCard.module.css";
import { IEvent } from "@database/eventSchema";
import { fallbackBackgroundImage } from "app/lib/random";

type Props = {
    setImageURL: Dispatch<SetStateAction<string | null>>, 
    setPreselected: Dispatch<SetStateAction<boolean>>, 

}



const ImageCard = ({image, onClick}: {image: string, onClick : any}) => {
  const backgroundImage = fallbackBackgroundImage(image, "/beaver-eventcard.jpeg") 
  return (
    <div
      className={style.imageCard}
      style={{
        background: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backdropFilter: "brightness(50%)"
      }}
        onClick={onClick}
    >
      <div className={style.eventTitle}>
        <h2>Your Event Name</h2>
      </div>
      <div className={style.bottomRow}>
        <div className={style.eventInfo}>
        </div>
        <div className={style.visitorCount}>
        </div>
      </div>
    </div>
  );
};


// TODO: add parent that loads images and passes to selector

export default function ImageSelector({setImageURL, setPreselected}: Props) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [images, setImages] = useState<string[]>([])
    // fetch images
    useEffect(() => {
        const loadImages = async () => {
            const res = await getAllImagesS3()
            const imageRes = JSON.parse(res)
            console.log(imageRes)
            setImages(imageRes)
        } 
        loadImages()
    }, [])
    return (
      <>
    <Box
          position="relative"
          borderWidth="1px"
          p="4"
          mt="4"
          textAlign="center"
          h="64"
          borderRadius="20px"
          overflow="hidden"
          bg="gray.200"
          width="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          onClick={onOpen}
        >
              <Text>Select From Existing Images</Text>
              <IconButton aria-label="Upload image" icon={<AddIcon />} mt="2" />
        </Box>

  
        <Modal isOpen={isOpen} onClose={onClose} size={'xl'}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Select Existing Images</ModalHeader>
            <ModalCloseButton />
            <ModalBody style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {images.map((image, idx) => (
                <ImageCard onClick={() => {setImageURL(image); setPreselected(true)}} key={idx} image={image} />
            ))}
            </ModalBody>
            <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>


      </>
    )
}

