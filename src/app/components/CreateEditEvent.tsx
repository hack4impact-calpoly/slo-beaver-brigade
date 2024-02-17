import { Modal, 
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
  FormLabel } from "@chakra-ui/react";
import { Button } from "@styles/Button";

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

  const handleDelete = async () => {
    try {
      // DELETE request to api
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'DELETE',
        // placeholder for more headers if needed
      });
      if (response.ok) {
        // setShowSuccessMessage(true);
        onClose();
      } else {
        console.error('Failed to delete event:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while deleting event:', error);
    }
  };
  
  return (
    <>
      {/* <Button onClick={onOpen}>
        <>
            {create ? "Create " : "Edit "} Event

        </>     
      </Button> */}

      <Modal isOpen={showModal} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#a3caf0" fontWeight="bold" position="relative">
            <>{create ? "Create " : "Edit "} Event</>
          </ModalHeader>
          <ModalCloseButton size="l" />

          <ModalBody>
            <Stack spacing={3}>
              <Input
                variant="flushed"
                placeholder="Event Name"
                fontWeight="bold"
              />
              <Input
                variant="flushed"
                placeholder="Event Location"
                fontWeight="bold"
              />
              <Stack spacing={0}>
                <FormLabel color="grey" fontWeight="bold">
                  Event Date
                </FormLabel>
                <Input
                  placeholder="Select Date"
                  size="md"
                  type="date"
                  color="grey"
                />
              </Stack>
              <Stack spacing={0}>
                <FormLabel color="grey" fontWeight="bold">
                  Event Description
                </FormLabel>
                <Textarea placeholder="Event Description" />
              </Stack>
              <Stack spacing={0}>
                <FormLabel color="grey" fontWeight="bold">
                  Event Type
                </FormLabel>
                <Select placeholder="Select option" color="grey">
                  <option value="option1">Watery Walk</option>
                  <option value="option2">Pond Clean Up</option>
                  <option value="option3">Habitat Monitoring</option>
                </Select>
              </Stack>
              <Switch fontWeight="bold" color="grey">
                Wheelchair Accessibility
              </Switch>
              <Switch fontWeight="bold" color="grey">
                Spanish Speaking Accommodation
              </Switch>
            </Stack>
          </ModalBody>

          <ModalFooter>
            {/* Button for deleting event */}
            {!create && (
              <Button onClick={handleDelete} mr={2} colorScheme="red">
                Delete
              </Button>
            )}
            {/* Button for closing the modal */}
            <Button onClick={onClose}>Close</Button>
            {/* Button for saving or creating event */}
            <Button>{create ? "Create" : "Save"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Success message */}
      {/* showSuccessMessage && (
        <div>
          Event deleted successfully!
        </div>
      )*/}
    </>
  );
};

export default CreateEditEvent;
