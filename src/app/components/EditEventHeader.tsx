'use client'
import { Box, Card, Badge, Text, Button, Flex,  
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton, useDisclosure} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react'
import styles from "../styles/admin/editEvent.module.css";
import { IEvent } from '@database/eventSchema';
import { useRouter} from 'next/navigation';

const EditEventHeader = ({ eventId }: { eventId: string }) => {
    const router = useRouter();

    const [eventData, setEventData] = useState<IEvent>({
        _id: '',
        eventName: '',
        location: '',
        description: '',
        wheelchairAccessible: false,
        spanishSpeakingAccommodation: false,
        startTime: new Date(0),
        endTime: new Date(0),
        volunteerEvent: false,
        groupsAllowed: [],
        attendeeIds: [],
    });

    function DeleteEvent({eventName, onDelete}: {eventName: string, onDelete: () => void}){
        const { isOpen, onOpen, onClose } = useDisclosure() 
        return(
            <>
            <button className={styles.deleteButton} onClick={onOpen}>Delete Event</button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay/>
              <ModalContent className={styles.confirmDeletion} maxW="40rem">
                <ModalHeader style={{width:"100%"}}>Please confirm deletion of {eventName} Event.</ModalHeader>
                <ModalCloseButton />
                <ModalBody className={styles.cancelOrDelete}>
                    <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
                    <button className={styles.deleteButton} onClick={onDelete}>Delete</button>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )
    }

    const handleDelete = async () => {
        try{
            const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
            method: 'DELETE'
            });
            if (response.ok) {
                console.log('Event deleted successfully');
                // Redirect or update UI as needed
            } else {
                console.error('Failed to delete event:', response.statusText);
            }
            router.push('/');
        }
        catch(error){
            console.error('Error deleting event:', error);
        }
        
    }

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error, status: ${response.status}`);
                }
                const data = await response.json();
                data.startTime = new Date(data.startTime);
                data.endTime = new Date(data.endTime);
                setEventData(data);
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };
        fetchEventData();
    }, [eventId]);

    return(
        <Box className = {styles.header}>
            <h1 className = {styles.eventTitle}>{eventData.eventName} Details</h1>
            <DeleteEvent eventName={eventData.eventName} onDelete={handleDelete}/>
        </Box>
    );
}

export default EditEventHeader;
  