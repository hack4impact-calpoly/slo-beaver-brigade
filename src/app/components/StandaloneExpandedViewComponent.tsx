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
  Text
  
} from "@chakra-ui/react";
import React, { useRef, useState } from 'react';
import { IEvent } from "@database/eventSchema";
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

interface Props {
  eventDetails: IEvent;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpandedTest = ({ eventDetails, showModal, setShowModal }: Props) => {
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


  const formattedDate = new Date(eventDetails.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
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
  
  return (
  <>
  <Modal isOpen={showModal} onClose={closeExpandedView} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
          <ModalHeader bg="#a3caf0" fontWeight="bold" position="relative">
              <Flex justify={"right"}>
                  <>{eventDetails.eventName}</>
                  <Spacer/>
                  <Button onClick={onOpen} variant="link" leftIcon={<EditIcon />}></Button>
                  <Button onClick={closeExpandedView} variant="link" leftIcon={<DeleteIcon />}></Button>
              </Flex>
          </ModalHeader>

          <ModalBody>
              <Stack spacing={3}>
                  <Stack spacing={0}>
                      <FormLabel color="grey" fontWeight="bold">
                          Time:
                      </FormLabel>
                      <Text>
                          <strong>{formattedDate} from {formattedStartTime} - {formattedEndTime}</strong>
                      </Text>
                  </Stack>
                  <Stack spacing={0}>
                      <FormLabel color="grey" fontWeight="bold">
                          Location:
                      </FormLabel>
                      <Text>
                          <strong>{eventDetails.location}</strong>
                      </Text>
                  </Stack>
                  <Stack spacing={0}>
                      <FormLabel color="grey" fontWeight="bold">
                          Description:
                      </FormLabel>
                      <Text mb={12}>
                          {eventDetails.description}
                      </Text>
                  </Stack>
                  <Flex
                      direction={{ base: 'column', md: 'row' }}
                      alignItems={{ base: 'center', md: 'flex-start' }}
                      justifyContent={{ base: 'center', md: 'space-evenly' }}
                      flexWrap="wrap"
                  >
                      <Button
                          onClick={onOpen}
                          bg="lightblue"
                          fontSize={{ base: 'xl', md: 'md' }}
                          mb={{ base: 2, md: 5 }}
                          p={{ base: '2', md: '2' }}
                          flexBasis={{ base: '100%', md: 'auto' }}
                      >
                          <strong>Sign Up As Guest</strong>
                      </Button>
                      <Button
                          onClick={onOpen}
                          bg="lightblue"
                          fontSize={{ base: 'xl', md: 'md' }}
                          ml={{ base: 0, md: 2 }}
                          p={{ base: '2', md: '2' }}
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

export default ExpandedTest;
