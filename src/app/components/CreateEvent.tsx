import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
    } from '@chakra-ui/react'
import { Button } from '@styles/Button'

export default function CreateEvent() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Create Event</Button>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            You can create an event here
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>
              Close
            </Button>
            <Button>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
      
  )
}


