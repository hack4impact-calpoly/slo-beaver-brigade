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
import { useEventId } from 'app/lib/swrfunctions';
import { mutate } from 'swr';

const EditEventHeader = ({ eventId }: { eventId: string }) => {
    const router = useRouter();

    const {eventData, isLoading, isError} = useEventId(eventId)

    function DeleteEvent({eventName, onDelete}: {eventName: string, onDelete: () => void}){
        const { isOpen, onOpen, onClose } = useDisclosure() 
        return(
            <>
            <button className={`${styles.headerDeleteButton} ${styles.headerButton}`} onClick={onOpen}>Delete Event</button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay/>
              <ModalContent className={styles.confirmDeletion} maxW="fit-content">
                <ModalHeader style={{width:"100%"}}>Please confirm deletion of {eventName} Event.</ModalHeader>
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


    return(
        <Box className = {styles.header}>
             <button className={`${styles.backButton} ${styles.headerButton}`} onClick={() => router.back()}>Back</button>
            <DeleteEvent eventName={eventData?.eventName || "Error."} onDelete={handleDelete}/>
        </Box>
    );
}

export default EditEventHeader;
  