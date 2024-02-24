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
  import { IEvent } from '@database/eventSchema';
  import { Button } from '@styles/Button'
  import React, {useState} from 'react';  
  
  const EditEvent = (event: IEvent) => {
    const { isOpen, onOpen, onClose } = useDisclosure() // button open/close
  
    const [name, setName] = useState(event.eventName) 
    const [loc, setLoc] = useState(event.location)
    const [date, setDate] = useState(getDate(event.startTime))
    const [start, setStart] = useState(getTime(event.startTime))
    const [end, setEnd] = useState(getTime(event.endTime))
    const [desc, setDesc] = useState(event.description)
    const [type, setType] = useState('')
    const [vol, setVol] = useState(event.volunteerEvent)
    const [myGrp, setMyGrp] = useState(false)
    const [wc, setWC] = useState(event.wheelchairAccessible)
    const [span, setSpan] = useState(event.spanishSpeakingAccommodation)

  
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
      setName(event.eventName)
      setLoc(event.location)
      setDate(getDate(event.startTime))
      setStart(getTime(event.startTime))
      setEnd(getTime(event.endTime))
      setDesc(event.description)
      setType('')
      setVol(event.volunteerEvent)
      setMyGrp(false)
      setWC(event.wheelchairAccessible)
      setSpan(event.spanishSpeakingAccommodation)
      setIsSubmitted(false)
      onClose()
    }

    function getDate(x:Date): string {
        let localeDate: string = x.toLocaleDateString('en-Us')
        let localeDateParts = localeDate.split('/')
        let y: string = localeDateParts[2]
        let m: string = localeDateParts[0]
        let d: string = localeDateParts[1]
        if (m.length == 1) {m = '0'.concat(m)}
        if (d.length == 1) {d = '0'.concat(d)}
        return y.concat('-', m, '-', d)
    }

    function getTime(x:Date): string {
        let time: string = x.toLocaleTimeString()
        let timeParts: string[] = time.split(':')
        let h: string = timeParts[0]
        let m: string = timeParts[1]
        let amPM: string = timeParts[2].split(' ')[1]

        if (h.localeCompare('12') == 0 && amPM.localeCompare('AM') == 0) {
            h = (parseInt(h) - 12).toString() 
        }
        if (amPM.localeCompare('PM') == 0 && h.localeCompare('12') != 0) {
            h = (parseInt(h) + 12).toString()
        }
        if (h.length == 1) {
            h = '0'.concat(h)
        }
        return h.concat(':', m)
    }
  
    function HandleSubmit() {setIsSubmitted(true)}
  
    return (
      <>
        <Button onClick={onOpen}>
          Edit Event
        </Button>
  
        <Modal isOpen={isOpen} onClose={HandleClose} size='xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg='#a3caf0' fontWeight='bold' position='relative'>
              Edit Event
            </ModalHeader>
            <ModalCloseButton size='l'/>    
  
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
                  Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>      
    )
  }
  
  export default EditEvent
  