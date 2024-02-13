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
  FormLabel,
} from "@chakra-ui/react";
import { Button } from "@styles/Button";

<<<<<<< HEAD:src/app/components/CreateEditEvent.tsx
interface Props {
  create: boolean;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

/* if create var is True, it will be a Create Event component, 
    otherwise it will be Edit Event Component */

const CreateEditEvent = ({ create, showModal, setShowModal }: Props) => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const onClose = () => setShowModal(false)
  
=======

    
const CreateEvent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
>>>>>>> 606873f (fix: separated CreateEditEvent into two components):src/app/components/CreateEvent.tsx
  return (
    <>
      <Button onClick={onOpen}>
            Create Event
      </Button>

      <Modal isOpen={showModal} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
<<<<<<< HEAD:src/app/components/CreateEditEvent.tsx
          <ModalHeader bg="#a3caf0" fontWeight="bold" position="relative">
            <>{create ? "Create " : "Edit "} Event</>
=======
          <ModalHeader bg='#a3caf0' fontWeight='bold' position='relative'>
              Create Event
>>>>>>> 606873f (fix: separated CreateEditEvent into two components):src/app/components/CreateEvent.tsx
          </ModalHeader>
          <ModalCloseButton size="l" />

          <ModalBody>
            <Stack spacing={3}>
                <Input variant='flushed' placeholder='Event Name' fontWeight='bold'/>
                <Input variant='flushed' placeholder='Event Location' fontWeight='bold'/>
                <Stack spacing={0}>
                    <FormLabel color='grey' fontWeight='bold'>Event Date</FormLabel>
                    <Input placeholder="Select Date" size="md" type="date" color='grey'/>
                </Stack>
                <Stack spacing={0}>
                    <FormLabel color='grey' fontWeight='bold'>Event Time</FormLabel>
                    <Input placeholder="Select Time" size="md" type="time" color='grey'/>
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
            <Button onClick={onClose}>Close</Button>
            <Button>
<<<<<<< HEAD:src/app/components/CreateEditEvent.tsx
              <>{create ? "Create" : "Save"}</>
=======
                Create
>>>>>>> 606873f (fix: separated CreateEditEvent into two components):src/app/components/CreateEvent.tsx
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

<<<<<<< HEAD:src/app/components/CreateEditEvent.tsx
export default CreateEditEvent;
=======
export default CreateEvent
>>>>>>> 606873f (fix: separated CreateEditEvent into two components):src/app/components/CreateEvent.tsx
