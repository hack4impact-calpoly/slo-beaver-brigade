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
import { IEvent } from '@database/eventSchema';

interface EventExpandedViewProps {
  eventDetails: IEvent;
  showExpandedView: boolean;
  setShowExpandedView: React.Dispatch<React.SetStateAction<boolean>>;
}

const EventExpandedView: React.FC<EventExpandedViewProps> = ({ eventDetails,showExpandedView,setShowExpandedView }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  //const [showExpandedView, setShowExpandedView] = useState(false);

  
  const triggerButtonRef = useRef<HTMLButtonElement | null>(null);

  function closeExpandedView() {
    setShowExpandedView(false);
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
    <Center>
      <Box borderWidth="1px" borderRadius="lg" bg="lightblue" m={{ base: '2', md: '0' }}
        >
        {/* Title Section */}
        {/* <Box cursor="pointer" mb={1} bg="lightblue" p={2} borderRadius="md" onClick={() => setShowExpandedView(!showExpandedView)}>
          <Flex align="center" justify="space-between">
            <Text fontWeight="bold" fontSize="2xl">{eventDetails.eventName}</Text>
            <Flex>
              <Button onClick={() => setShowExpandedView(!showExpandedView)} variant="link" >
                {showExpandedView ? <CloseIcon /> : <ChevronDownIcon/>}
              </Button>
            </Flex>
          </Flex>
        </Box> */}

        {/* Content Section */}
        {showExpandedView && (
          <Box bg="white" p={4}>
            <Flex align="center" justify="space-between">
              <Text>
                <strong>{formattedDate} from {formattedStartTime} - {formattedEndTime}</strong>
              </Text>
              <Flex>
                <Button onClick={onOpen} variant="link" leftIcon={<EditIcon />}></Button>
                <Button onClick={closeExpandedView} variant="link" leftIcon={<DeleteIcon />}></Button>
              </Flex>
            </Flex>
            <Text>
              <strong>{eventDetails.location}</strong>
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
          </Box>
        )}
      </Box>
    </Center>
  );
};

export default EventExpandedView;