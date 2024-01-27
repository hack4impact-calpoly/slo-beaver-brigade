// src/app/components/EventExpandedView.tsx
"use client";
import React, { useContext } from 'react';
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
  } from '@chakra-ui/react';
  

interface EventExpandedViewProps {
    eventDetails: {
        name: string;
        date: string;
        time: string;
        location: string;
        description: string;
    }
}

const EventExpandedView: React.FC<EventExpandedViewProps> = ({eventDetails}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // needed the authentication to be implemented first
  //const { isAdmin } = useContext(AuthContext); // Update based on your actual auth context

  const isAdmin = true;

  return (
    <center>
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <h2>{eventDetails.name}</h2>
      <p>{eventDetails.description}</p>
      <Button onClick={onOpen}>Sign Up</Button>

      {/* Conditional Edit/Delete Buttons */}
      {isAdmin && ( // isAdmin
        <>
          <Button>Edit</Button>
          <Button>Delete</Button>
        </>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{eventDetails.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>{eventDetails.description}</p>
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
    </center>
  );
};

export default EventExpandedView;