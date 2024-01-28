// src/app/components/EventExpandedView.tsx
"use client";
import React, { useContext, useRef, useState } from 'react';
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
    Divider,
    Text,
    Flex,
  } from '@chakra-ui/react';
  import { EditIcon, DeleteIcon, CloseIcon} from '@chakra-ui/icons';
  

interface EventExpandedViewProps {
    eventDetails: {
        name: string;
        date: string;
        time: string;
        location: string;
        description: string;
        weekDay: string;
        numVolunteers: number;
        numVolunteersNeeded: number;
    }
}

const EventExpandedView: React.FC<EventExpandedViewProps> = ({eventDetails}) => {
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


  
  // needed the authentication to be implemented first
  //const { isAdmin } = useContext(AuthContext); // Update based on your actual auth context

  const isAdmin = true;
  const isAuthenticated = true;
  

  return (
    <Center>
      <Box borderWidth="1px" borderRadius="lg" width="40%" bg="lightblue">
        {/* Title Section */}
        <Box mb={1} bg="lightblue" p={2} borderRadius="md">
        <Flex align="center" justify="space-between">
          <Text fontWeight="bold" fontSize="2xl">{eventDetails.name}</Text>
          <Flex>
          <Button onClick={toggleModal} ref={triggerButtonRef} variant="link" leftIcon={<CloseIcon />}>
          </Button>
          </Flex>
        </Flex>
        </Box>
        

        {/* Content Section */}
        <Box bg="white" p={4} >
            <Flex align="center" justify="space-between">
                <Text>
                    <strong>{eventDetails.weekDay}, {eventDetails.date} from {eventDetails.time}</strong> 
                </Text>
                <Flex>
                    {isAdmin && (
                    <>
                        <Button onClick={onOpen} variant="link" leftIcon={<EditIcon />}>
                        </Button>
                        <Button onClick={onClose} variant="link" leftIcon={<DeleteIcon />}>
                        </Button>
                    </>
                    )}
                </Flex>
            </Flex>
          <Text>
            <strong>{eventDetails.location}</strong> 
          </Text>
          <Text mb={8}>
            <strong>{eventDetails.numVolunteers}/{eventDetails.numVolunteersNeeded} Participants</strong> 
          </Text>
          <Text mb={2}>
            {eventDetails.description}
          </Text>
        
          {!isAuthenticated ? (
            <Flex justifyContent="space-evenly">
                <Button mt={20} onClick={onOpen} bg="lightblue" fontSize="md">
                <strong>Sign Up As Guest</strong>
                </Button>
                <Button mt={20} onClick={onOpen} bg="lightblue" fontSize="md">
                <strong>Continue With An Account</strong>
                </Button>
            </Flex>
          ) : (
            <Flex>
            <Button mt={20} onClick={onOpen} bg="lightblue" fontSize="md" ml="auto">
                <strong>Sign Up</strong>
            </Button>
            </Flex>
          )}

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
                {/* Additional modal content can be added here */}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </Center>
  );
};

export default EventExpandedView;