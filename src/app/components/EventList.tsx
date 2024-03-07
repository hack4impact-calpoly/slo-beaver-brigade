'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { IEvent } from '@database/eventSchema';
import { Box, Card, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

const EventListRegister = ({showModal, setShowModal} : {showModal : boolean, setShowModal: React.Dispatch<React.SetStateAction<boolean>>}) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    setLoading(false);

    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    try {
      await fetch(`/api/events/${eventId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.unsafeMetadata.dbId }),
      });
      router.refresh()
      setShowModal(false);
      // Optionally, update the local state or refetch the events
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
              {loading && <p>Loading...</p>}
              {!events && !loading && <p>No events found.</p>}
              {events && !loading && <p>Found {events.length} events.</p>}
              {events.map((event) => (
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
