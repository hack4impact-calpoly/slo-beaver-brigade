import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
  FormLabel,
  Flex,
  Button,
  Spacer,
  Text,
  Box,
} from "@chakra-ui/react";
import React, { useRef, useState } from 'react';
import { IEvent } from "@database/eventSchema";
import { CalendarIcon,TimeIcon,CloseIcon} from '@chakra-ui/icons';
import { fallbackBackgroundImage } from "app/lib/random";
import { PiMapPinFill } from "react-icons/pi";
import { MdCloseFullscreen } from "react-icons/md";

interface Props {
  eventDetails: IEvent | null;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ExpandedViewComponent ({ eventDetails, showModal, setShowModal }: Props)  {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);


  function closeExpandedView() {
    setShowModal(false);
  }

  const toggleModal = () => {
    if (isOpen) {
      onClose();
      if (triggerButtonRef.current) {
        triggerButtonRef.current.focus();
      }
    } else {
      onOpen();
    }
  };

  if (eventDetails == null){
    return (
        <></>
    )
  }

  const formattedDate = new Date(eventDetails.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const formattedStartTime = new Date(eventDetails.startTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const formattedEndTime = new Date(eventDetails.endTime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  
  const backgroundImage = fallbackBackgroundImage(eventDetails.eventImage)
  return (
  <>
  <Modal isOpen={showModal} onClose={closeExpandedView} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent>
          <ModalHeader bg={backgroundImage} fontWeight="bold" position="relative" color={"white"} backgroundSize={"cover"} backgroundPosition={"60% 45%"} borderRadius={"5px 5px 0px 0px"}>
              <Flex justify={"right"} ml={"5%"}>
                  <Text fontSize={"5xl"} opacity={"85%"}>{eventDetails.eventName}</Text>
                  <Spacer/>
                  <Button onClick={closeExpandedView} variant="link"  color={"white"} size={"xl"} leftIcon={<MdCloseFullscreen />}></Button>
              </Flex>
              <Flex flexDirection={"column"} fontSize={"sm"} opacity={"85%"} mb={"7%"} ml={"5%"}>
                <Flex>
                    <Box mt={"5px"}>
                        <PiMapPinFill/>
                    </Box>
                    <Text ml={"5px"}>{eventDetails.location}</Text>
                </Flex>
                <Flex>
                    <CalendarIcon mt={"5px"}/>
                    <Text ml={"5px"}>{formattedDate}</Text>
                </Flex>
                <Flex>
                    <TimeIcon mt={"5px"}/>
                    <Text ml={"5px"}>{formattedStartTime} - {formattedEndTime}</Text>
                </Flex>
              </Flex>
          </ModalHeader>

          <ModalBody>
              <Stack spacing={5} width={"100%"}>
                    <Flex ml={"5%"}>
                        <Flex direction={"column"} width={"50%"}>
                            <FormLabel color="grey" fontWeight="light" fontSize={"2xl"}>
                                Description:
                            </FormLabel>
                            <Text fontWeight={"bold"} maxW={"90%"}>
                                {eventDetails.description}
                            </Text>
                        </Flex>
                        <Stack spacing={0}>
                            <FormLabel color="grey" fontWeight="light" fontSize={"2xl"}>
                                Spanish Speaking:
                            </FormLabel>
                            {eventDetails.spanishSpeakingAccommodation ? 
                                <Text fontWeight={"bold"}>Yes</Text> :
                                <Text fontWeight={"bold"}>No</Text>
                            }
                        </Stack>
                    </Flex>
                    <Flex ml={"5%"}>
                        <Flex direction={"column"} width={"50%"}>
                            <FormLabel color="grey" fontWeight="light" fontSize={"2xl"}>
                                Checklist:
                            </FormLabel>
                            <Text fontWeight={"bold"} maxW={"90%"}>
                                {eventDetails.description}
                            </Text>
                        </Flex>
                        <Stack spacing={0}>
                            <FormLabel color="grey" fontWeight="light" fontSize={"2xl"}>
                                Wheelchair Accessible:
                            </FormLabel>
                            {eventDetails.wheelchairAccessible ? 
                                <Text fontWeight={"bold"}>Yes</Text> :
                                <Text fontWeight={"bold"}>No</Text>
                            }
                        </Stack>
                    </Flex>


                  <Flex
                      direction={{ base: 'column', md: 'row' }}
                      alignItems={{ base: 'center', md: 'flex-start' }}
                      justifyContent={{ base: 'center', md: 'space-evenly' }}
                      flexWrap="wrap"
                      mt={"10%"}
                    >
                      <Button
                          onClick={onOpen}
                          bg="#006d75"
                          color="white"
                          fontWeight={"light"}
                          fontSize={{ base: 'xl', md: 'md' }}
                          mb={{ base: 2, md: 5 }}
                          pl={"10"}
                          pr={"10"}
                          flexBasis={{ base: '100%', md: 'auto' }}
                      >
                          <strong>Sign Up</strong>
                      </Button>
                      <Button
                          onClick={onOpen}
                          bg="#006d75"
                          color="white"
                          fontWeight={"light"}
                          fontSize={{ base: 'xl', md: 'md' }}
                          ml={{ base: 0, md: 2 }}
                          pl={"5"}
                          pr={"5"}
                          flexBasis={{ base: '100%', md: 'auto' }}
                      >
                          <strong>Continue With An Account</strong>
                      </Button>
                  </Flex>
              </Stack>
          </ModalBody>
      </ModalContent>
  </Modal>
  <Modal
      isOpen={isOpen}
      onClose={toggleModal}
      initialFocusRef={triggerButtonRef}
      isCentered
  >
      <ModalOverlay />
      <ModalContent>
      <ModalHeader>{eventDetails.eventName}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
          <Text>{eventDetails.description}</Text>
      </ModalBody>
      <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>
          Close
          </Button>
      </ModalFooter>
      </ModalContent>
  </Modal>
  </>
  );
};

export default ExpandedViewComponent;
