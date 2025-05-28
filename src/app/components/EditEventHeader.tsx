'use client'
import { Box, Card, Badge, Text, Button, Flex,  
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton, useDisclosure,
    useToast} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react'
import styles from "../styles/admin/editEvent.module.css";
import { IEvent } from '@database/eventSchema';
import { useRouter} from 'next/navigation';
import { useEventId } from 'app/lib/swrfunctions';
import { mutate } from 'swr';

const EditEventHeader = ({ eventId }: { eventId: string }) => {
    const router = useRouter();
    const toast = useToast();
    const {eventData, isLoading, isError} = useEventId(eventId);
    const [registrationOpen, setRegistrationOpen] = useState(eventData?.isOpen);
    console.log(registrationOpen);

    function DeleteEvent({eventName, onDelete}: {eventName: string, onDelete: () => void}){
        const { isOpen, onOpen, onClose } = useDisclosure() 
        return(
            <>
            <button className={`${styles.headerDeleteButton} ${styles.headerButton}`} onClick={onOpen}>Delete Event</button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay/>
              <ModalContent className={styles.confirmDeletion} maxW="fit-content">
                <ModalHeader style={{width:"100%", textAlign:"center"}}>Please confirm deletion of {eventName} Event.</ModalHeader>
                <ModalCloseButton />
                <ModalBody className={styles.cancelOrDelete}>
                    <button className={`${styles.cancelButton} ${styles.confirmationButton}`} onClick={onClose}>Cancel</button>
                    <button className={`${styles.deleteButton} ${styles.confirmationButton}`} onClick={onDelete}>Delete</button>
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )
    }

    const handleDelete = async () => {
        try{
            const response = await fetch(`/api/events/${eventId}`, {
            method: 'DELETE'
            });
            if (response.ok) {
                
                // Redirect or update UI as needed
            } else {
                console.error('Failed to delete event:', response.statusText);
            }
            mutate("/api/events")
            router.push('/admin/events');
        }
        catch(error){
            console.error('Error deleting event:', error);
        }
        
    }

    const changeRegistrationStatus = async () => {
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    isOpen: !registrationOpen
                }),
            });
            toast({
                title: `Registration ${!registrationOpen ? "Opened" : "Closed"}`,
                description: `This event's registration status is now ${!registrationOpen ? "opened" : "closed"}`,
                status: "success",
                duration: 5000,
                isClosable: true,
            })


            setRegistrationOpen(!registrationOpen);

        } catch (error) {
            console.error('Error ending registration:', error);
        }


    }


    return(
        <Box className = {styles.header}>
            <button className={`${styles.backButton} ${styles.headerButton}`} onClick={() => router.back()}>Back</button>
            <Box className={styles.rightButtons}>
                {registrationOpen && <button className={`${styles.headerStopButton} ${styles.headerButton}`} onClick={changeRegistrationStatus}>Stop Registration</button>}
                {!registrationOpen && <button className={`${styles.headerOpenButton} ${styles.headerButton}`} onClick={changeRegistrationStatus}>Open Registration</button>}
                <DeleteEvent eventName={eventData?.eventName || "Error."} onDelete={handleDelete}/>
            </Box>
            
        </Box>
    );
}

export default EditEventHeader;
  