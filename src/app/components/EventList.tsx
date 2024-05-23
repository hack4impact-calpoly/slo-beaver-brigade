'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { IEvent } from '@database/eventSchema';
import { Box, Card, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEventsAscending } from 'app/lib/swrfunctions';

const EventListRegister = ({showModal, setShowModal} : {showModal : boolean, setShowModal: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const {events, isLoading, mutate} = useEventsAscending()
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user } = useUser();
  const router = useRouter();


  const handleRegister = async (eventId: string) => {
    try {
      await fetch(`/api/events/${eventId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.unsafeMetadata.dbId }),
      });
      setShowModal(false);
     
      router.refresh();
      router.refresh();
    } catch (error) {
      console.error('Error registering for the event:', error);
    }
  };

  if (showModal){
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Register for an Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {isLoading && <p>Loading...</p>}
              {!events && !loading && <p>No events found.</p>}
              {events && !loading && <p>Found {events.length} events.</p>}
              {events && events.map((event) => (
                <Card key={event._id}>
                  <h3>{event.eventName}</h3>
                  <p>{event.description}</p>
                  {isSignedIn && (
                    <button onClick={() => handleRegister(event._id)}>Register</button>
                  )}
                </Card>
              ))}
            </ModalBody>
          </ModalContent>
        </Modal>
      );
      
  }
};

export default EventListRegister;
