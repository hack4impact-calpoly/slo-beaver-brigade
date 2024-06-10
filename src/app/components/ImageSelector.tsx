import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Text,  Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Box, IconButton, Image } from "@chakra-ui/react";
import { getAllImagesS3, removeImageS3 } from "app/actions/imageactions";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import style from "@styles/admin/eventCard.module.css";

type Props = {
    setImageURL: Dispatch<SetStateAction<string | null>>, 
    setPreselected: Dispatch<SetStateAction<boolean>>, 

}

const ImageCard = ({image, onClick}: {image: string, onClick : any}) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDeleteClick = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault();
        await removeImageS3(image); // Ensure this is an async function call
        setIsVisible(false); // Hide the card after deletion
    };

    if (!isVisible) {
        return null; // Don't render anything if the card is not visible
    }

    return (
        <div
        role="group"
        className={style.imageCard}
        onClick={onClick}
        >
        <Image
            src={image || "/beaver-eventcard.jpeg"}
            alt="Event Image"
            objectFit="cover"
            position="absolute"
            zIndex="-1"
            top="0"
            left="0"
            width="100%"
            height="100%"
            filter={"brightness(50%)"}
            borderRadius={"8px"}
        />
        <div className={style.eventTitle} style={{ display: 'flex', flexDirection: "row" }}>
            <h2>Your Event Name</h2>

            <DeleteIcon 
            onClick={handleDeleteClick}
            opacity="75%"
            fontSize={'25px'}
            visibility={"hidden"}
            _groupHover={{ visibility: "visible" }}
            />
        </div>
        <div className={style.bottomRow}>
            <div className={style.eventInfo}>
            {/* Additional event info can go here */}
            </div>
            <div className={style.visitorCount}>
            {/* Visitor count or other info can go here */}
            </div>
        </div>
        </div>
    );
};


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

