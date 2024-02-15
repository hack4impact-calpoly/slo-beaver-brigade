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
  FormControl,
  FormLabel
} from '@chakra-ui/react'
import { Button } from '@styles/Button'
import React, {useState} from 'react';

const CreateEvent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure() // button open/close

  const [name, setName] = useState('') 
  const [loc, setLoc] = useState('')
  const [date, setDate] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [desc, setDesc] = useState('')
  const [type, setType] = useState('')
  const [vol, setVol] = useState(false)
  const [myGrp, setMyGrp] = useState(false)
  const [wc, setWC] = useState(false)
  const [span, setSpan] = useState(false)

  const handleNameChange = (e: any) => setName(e.target.value)
  const handleLocationChange = (e: any) => setLoc(e.target.value)
  const handleDateChange = (e: any) => setDate(e.target.value)
  const handleStartChange = (e: any) => setStart(e.target.value)
  const handleEndChange = (e: any) => setEnd(e.target.value)
  const handleDescChange = (e: any) => setDesc(e.target.value)
  const handleTypeChange = (e: any) => setType(e.target.value)
  const handleVolChange = () => {
    setVol(!vol)
    if(vol) {
        setMyGrp(false)
    }
}
  const handleMyGrp = () => setMyGrp(!myGrp)
  const handleWCChange = () => setWC(!wc)
  const handleSpanChange = () => setSpan(!span)

  const [isSubmitted, setIsSubmitted] = useState(false)

  function HandleClose() {
    setName('')
    setLoc('')
    setDate('')
    setStart('')
    setEnd('')
    setDesc('')
    setType('')
    setVol(false)
    setMyGrp(false)
    setWC(false)
    setSpan(false)    
    setIsSubmitted(false)
    onClose()
  }

  function HandleSubmit() {setIsSubmitted(true)}

  return (
    <>
      <Button onClick={onOpen}>
        Create Event
      </Button>

      <Modal isOpen={isOpen} onClose={HandleClose} size='xl'>
        <ModalOverlay />
        <ModalContent>
<<<<<<< HEAD:src/app/components/CreateEditEvent.tsx
          <ModalHeader bg="#a3caf0" fontWeight="bold" position="relative">
            <>{create ? "Create " : "Edit "} Event</>
=======
          <ModalHeader bg='#a3caf0' fontWeight='bold' position='relative'>
            Create Event
          </ModalHeader>
          <ModalCloseButton size="l" />

          <ModalBody>
            <Stack spacing={3}>

              <FormControl isInvalid={name === '' && isSubmitted}>               
                <Input variant='flushed' placeholder='Event Name' fontWeight='bold' value={name} onChange={handleNameChange}/>
              </FormControl>

              <FormControl isInvalid={loc === '' && isSubmitted}>               
                <Input variant='flushed' placeholder='Event Location' fontWeight='bold' value={loc} onChange={handleLocationChange}/>
              </FormControl>

              <Stack spacing={0}>
                <FormControl isInvalid={date === '' && isSubmitted}>
                  <FormLabel color='grey' fontWeight='bold'>Event Date</FormLabel>
                  <Input placeholder="Select Date" size="md" type="date" color='grey' value={date} onChange={handleDateChange}/>
                </FormControl>
              </Stack>

              <Stack spacing={0}>
                <FormControl isInvalid={start === '' && isSubmitted}>
                  <FormLabel color='grey' fontWeight='bold'>Start Time</FormLabel>
                  <Input placeholder="Select Time" size="md" type="time" color='grey' value={start} onChange={handleStartChange}/>
                </FormControl>
              </Stack>

              <Stack spacing={0}>
                <FormControl isInvalid={end === '' && isSubmitted}>
                  <FormLabel color='grey' fontWeight='bold'>End Time</FormLabel>
                  <Input placeholder="Select Time" size="md" type="time" color='grey' value={end} onChange={handleEndChange}/>
                </FormControl>
              </Stack>

              <Stack spacing={0}>
                <FormControl isInvalid={desc === '' && isSubmitted}>
                  <FormLabel color='grey' fontWeight='bold'>Event Description</FormLabel>
                  <Textarea placeholder='Event Description' value={desc} onChange={handleDescChange}/>
                </FormControl>
              </Stack>

              <Stack spacing={0}>
                <FormControl isInvalid={type === '' && isSubmitted}>
                  <FormLabel color='grey' fontWeight='bold'>Event Type</FormLabel>
                  <Select placeholder='Select option' color='grey' value={type} onChange={handleTypeChange}>
                      <option value='option1'>Watery Walk</option>
                      <option value='option2'>Pond Clean Up</option>
                      <option value='option3'>Habitat Monitoring</option>
                  </Select>
                </FormControl>
              </Stack>

              <Switch fontWeight='bold' color='grey' isChecked={vol} onChange={handleVolChange}>Volunteer Event</Switch>

              <Switch fontWeight='bold' color='grey' isDisabled={!vol} isFocusable={!vol} isChecked={myGrp} onChange={handleMyGrp}>Only My Group Allowed</Switch>
  
              <Switch fontWeight='bold' color='grey' isChecked={wc} onChange={handleWCChange}>Wheelchair Accessibility</Switch>
  
              <Switch fontWeight='bold' color='grey' isChecked={span} onChange={handleSpanChange}>Spanish Speaking Accommodations</Switch>

            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={HandleClose}>
              Close
            </Button>
            <Button onClick={HandleSubmit}>
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
