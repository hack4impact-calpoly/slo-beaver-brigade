import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Textarea,
    Stack,
    FormControl,
    FormLabel,
    Button
} from '@chakra-ui/react';
import { IEvent } from '@database/eventSchema';

const CancelEvent = ({ event, onDelete }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [reason, setReason] = useState('');

    const handleReasonChange = (e) => setReason(e.target.value);

    const handleCancel = async () => {
        try {
            // note for fetch: not sure where to fetch from, hope this works
            await fetch(`@api/events/${event.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason }),
            });

            onDelete(event.id);

            onClose();
        } catch (error) {
            console.error('Error cancelling event:', error);
        }
    };

    return (
        <>
            <Button onClick={onOpen}>
                Cancel Event
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader bg='#a3caf0' fontWeight='bold' position='relative'>
                        Cancel Event
                    </ModalHeader>
                    <ModalCloseButton size='l' />

                    <ModalBody>
                        <Stack spacing={3}>
                            <FormControl isRequired>
                                <FormLabel color='grey' fontWeight='bold'>Reason for Cancellation</FormLabel>
                                <Textarea placeholder='Enter reason for cancellation' value={reason} onChange={handleReasonChange} />
                            </FormControl>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={handleCancel}>
                            Confirm Cancellation
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default CancelEvent;
