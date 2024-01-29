import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    Textarea,
    Select
    } from '@chakra-ui/react'
import { Button } from '@styles/Button'

export default function EditEvent() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Edit Event</Button>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg='#a3caf0' fontWeight='bold'>
            Edit Event
          </ModalHeader>
          <ModalCloseButton size='l'/>

          <ModalBody>
            <Input variant='flushed' placeholder='Event Name' fontWeight='bold'/>
            <Input variant='flushed' placeholder='Event Location' fontWeight='bold'/>
            <h1>Event Description</h1>
            <Textarea placeholder='Event Description' />
            <h3>Event Type</h3>
            <Select placeholder='Select option'>
                <option value='option1'>Type 1</option>
                <option value='option2'>Type 2</option>
                <option value='option3'>Type 3</option>
            </Select>
          </ModalBody>
          
          <ModalFooter>
            <Button onClick={onClose}>
              Close
            </Button>
            <Button>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
      
  )
}


