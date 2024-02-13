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
    Select,
    Switch,
    Stack,
    FormLabel
    } from '@chakra-ui/react'
import { Button } from '@styles/Button'

    
const CreateEvent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>
            Edit Event
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg='#a3caf0' fontWeight='bold' position='relative'>
            Edit Event
          </ModalHeader>
          <ModalCloseButton size='l'/>    

          <ModalBody>
            <Stack spacing={3}>
                <Input variant='flushed' placeholder='Event Name' fontWeight='bold'/>
                <Input variant='flushed' placeholder='Event Location' fontWeight='bold'/>
                <Stack spacing={0}>
                    <FormLabel color='grey' fontWeight='bold'>Event Date</FormLabel>
                    <Input placeholder="Select Date" size="md" type="date" color='grey'/>
                </Stack>
                <Stack spacing={0}>
                    <FormLabel color='grey' fontWeight='bold'>Event Description</FormLabel>
                    <Textarea placeholder='Event Description' />
                </Stack>
                <Stack spacing={0}>
                    <FormLabel color='grey' fontWeight='bold'>Event Type</FormLabel>
                    <Select placeholder='Select option' color='grey'>
                        <option value='option1'>Watery Walk</option>
                        <option value='option2'>Pond Clean Up</option>
                        <option value='option3'>Habitat Monitoring</option>
                    </Select>
                </Stack>
                <Switch fontWeight='bold' color='grey'>Wheelchair Accessibility</Switch>
                <Switch fontWeight='bold' color='grey'>Spanish Speaking Accommodation</Switch>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>
              Close
            </Button>
            <Button>
               Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>      
  )
}

export default CreateEvent