"use client";
import React, { useRef, useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Box,
  Center,
  Text,
  Flex,
  Stack
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';

interface EventExpandedViewProps {
  eventDetails: {
    name: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    location: string;
    description: string;
    weekDay: string;
    numVolunteers: number;
    numVolunteersNeeded: number;
  };
}

const EventExpandedView: React.FC<EventExpandedViewProps> = ({ eventDetails }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showExpandedView, setShowExpandedView] = useState(false);

  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

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

  return (
    <Center>
      <Box borderWidth="1px" borderRadius="lg" bg="lightblue" m={{ base: '2', md: '0' }} onClick={() => setShowExpandedView(!showExpandedView)}
        cursor="pointer">
        {/* Title Section */}
        <Box mb={1} bg="lightblue" p={2} borderRadius="md">
          <Flex align="center" justify="space-between">
            <Text fontWeight="bold" fontSize="2xl">{eventDetails.name}</Text>
            <Flex>
              <Button onClick={() => setShowExpandedView(!showExpandedView)} variant="link" >
                {showExpandedView ? <CloseIcon /> : <ChevronDownIcon/>}
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Content Section */}
        {showExpandedView && (
          <Box bg="white" p={4}>
            <Flex align="center" justify="space-between">
              <Text>
                <strong>{eventDetails.weekDay}, {eventDetails.date.toLocaleString('en-US', { month: 'long' })} from {eventDetails.startTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })} - {eventDetails.endTime.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}</strong>
              </Text>
              <Flex>
                <Button onClick={onOpen} variant="link" leftIcon={<EditIcon />}></Button>
                <Button onClick={onClose} variant="link" leftIcon={<DeleteIcon />}></Button>
              </Flex>
            </Flex>
            <Text>
              <strong>{eventDetails.location}</strong>
            </Text>
            <Text mb={8}>
              <strong>{eventDetails.numVolunteers}/{eventDetails.numVolunteersNeeded} Participants</strong>
            </Text>
            <Text mb={12}>
              {eventDetails.description}
            </Text>

            <Flex
              direction={{ base: 'column', md: 'row' }}
              alignItems={{ base: 'center', md: 'flex-start' }}
              mt={4}
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




            {/* Modal */}
            <Modal
              isOpen={isOpen}
              onClose={toggleModal}
              initialFocusRef={triggerButtonRef}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{eventDetails.name}</ModalHeader>
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
          </Box>
        )}
      </Box>
    </Center>
  );
};

export default EventExpandedView;