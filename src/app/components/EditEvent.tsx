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
  Switch,
  Stack,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { IEvent } from "@database/eventSchema";
import { Button } from "@styles/Button";
import React, { useState, useEffect } from "react";
import { CreatableSelect } from "chakra-react-select";

const EditEvent = ({event}: {event: IEvent}) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // button open/close

  const [name, setName] = useState(event.eventName);
  const [loc, setLoc] = useState(event.location);
  const [date, setDate] = useState(getDate(event.startTime));
  const [start, setStart] = useState(getTime(event.startTime));
  const [end, setEnd] = useState(getTime(event.endTime));
  const [desc, setDesc] = useState(event.description);
  const [type, setType] = useState(event.eventType);
  const [vol, setVol] = useState(event.volunteerEvent);
  const [myGrp, setMyGrp] = useState(false);
  const [wc, setWC] = useState(event.wheelchairAccessible);
  const [span, setSpan] = useState(event.spanishSpeakingAccommodation);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch("/api/events/bytype/eventType");
        const data: string[] = await response.json();
        const uniqueEventTypes = Array.from(
          new Set([...data, "Volunteer", "Beaver Walk", "Pond Clean Up"])
        );
        setEventTypes(uniqueEventTypes);
      } catch (error) {
        console.error("Error fetching event types:", error);
      }
    };

    fetchEventTypes();
  }, []);

  const handleNameChange = (e: any) => setName(e.target.value);
  const handleLocationChange = (e: any) => setLoc(e.target.value);
  const handleDateChange = (e: any) => setDate(e.target.value);
  const handleStartChange = (e: any) => setStart(e.target.value);
  const handleEndChange = (e: any) => setEnd(e.target.value);
  const handleDescChange = (e: any) => setDesc(e.target.value);

  const handleVolChange = () => {
    setVol(!vol);
    if (vol) {
      setMyGrp(false);
    }
  };
  const handleMyGrp = () => setMyGrp(!myGrp);
  const handleWCChange = () => setWC(!wc);
  const handleSpanChange = () => setSpan(!span);

  const [isSubmitted, setIsSubmitted] = useState(false);

  function HandleClose() {
    setName(event.eventName);
    setLoc(event.location);
    setDate(getDate(event.startTime));
    setStart(getTime(event.startTime));
    setEnd(getTime(event.endTime));
    setDesc(event.description);
    setType(event.eventType);
    setVol(event.volunteerEvent);
    setMyGrp(false);
    setWC(event.wheelchairAccessible);
    setSpan(event.spanishSpeakingAccommodation);
    setIsSubmitted(false);
    onClose();
  }

  function getDate(x: Date | null): string {
    if (!x) return '';
    let localeDate: string = x.toLocaleDateString("en-US", {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    let localeDateParts = localeDate.split("/");
  
    // Ensuring the array has all the required parts
    if (localeDateParts.length < 3) {
      console.error("Unexpected date format:", localeDate);
      return ''; // Return an empty string or a default date as fallback
    }
  
    let [month, day, year] = localeDateParts;
  
    return `${year}-${month}-${day}`;
  }  

  function getTime(x: Date | null): string {
    if (!x) return '';
    let time: string = x.toLocaleTimeString();
    let [hour, minute] = time.split(':');
    let [formattedHour, amPM] = hour.split(' ');
  
    let h: number = parseInt(formattedHour);
    if (amPM === 'PM' && h !== 12) h += 12;
    if (amPM === 'AM' && h === 12) h = 0;
  
    return `${h.toString().padStart(2, '0')}:${minute}`;
  }

  function HandleSubmit() {
    const eventData = {
      eventName: name,
      eventType: type,
      location: loc,
      description: desc,
      startTime: new Date(`${date}T${start}`),
      endTime: new Date(`${date}T${end}`),
      wheelchairAccessible: wc,
      spanishSpeakingAccommodation: span,
      volunteerEvent: vol,
      groupsAllowed: myGrp ? [] : null,
      registeredIds: event.registeredIds ? event.registeredIds : [],
    };

    console.log("New Event Data:", eventData);
    fetch(`/api/events/${event._id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.text()) // Parsing JSON response
      .then((text) => {
        console.log("Server response:", text);
        const data = text.startsWith("Event updated:")
          ? JSON.parse(text.substring("Event updated: ".length))
          : {};
        setIsSubmitted(true);
        HandleClose();
        location.reload()
      })
      .catch((error) => {
        console.error("Error editing event:", error);
      });
  }

  return (
    <>
      <Button
        onClick={onOpen}
        style={{
          border: "none",
          fontWeight: "bold",
          padding: "0%",
          margin: "5px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        Edit Event Details
      </Button>

      <Modal isOpen={isOpen} onClose={HandleClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="#a3caf0" fontWeight="bold" position="relative">
            Edit Event
          </ModalHeader>
          <ModalCloseButton size="l" />

          <ModalBody>
            <Stack spacing={3}>
              <FormControl isInvalid={name === "" && isSubmitted}>
                <Input
                  variant="flushed"
                  placeholder="Event Name"
                  fontWeight="bold"
                  value={name}
                  onChange={handleNameChange}
                />
              </FormControl>

              <FormControl isInvalid={loc === "" && isSubmitted}>
                <Input
                  variant="flushed"
                  placeholder="Event Location"
                  fontWeight="bold"
                  value={loc}
                  onChange={handleLocationChange}
                />
              </FormControl>

              <Stack spacing={0}>
                <FormControl isInvalid={date === "" && isSubmitted}>
                  <FormLabel color="grey" fontWeight="bold">
                    Event Date
                  </FormLabel>
                  <Input
                    placeholder="Select Date"
                    size="md"
                    type="date"
                    color="grey"
                    value={date}
                    onChange={handleDateChange}
                  />
                </FormControl>
              </Stack>

              <Stack spacing={0}>
                <FormControl isInvalid={start === "" && isSubmitted}>
                  <FormLabel color="grey" fontWeight="bold">
                    Start Time
                  </FormLabel>
                  <Input
                    placeholder="Select Time"
                    size="md"
                    type="time"
                    color="grey"
                    value={start}
                    onChange={handleStartChange}
                  />
                </FormControl>
              </Stack>

              <Stack spacing={0}>
                <FormControl isInvalid={end === "" && isSubmitted}>
                  <FormLabel color="grey" fontWeight="bold">
                    End Time
                  </FormLabel>
                  <Input
                    placeholder="Select Time"
                    size="md"
                    type="time"
                    color="grey"
                    value={end}
                    onChange={handleEndChange}
                  />
                </FormControl>
              </Stack>

              <Stack spacing={0}>
                <FormControl isInvalid={desc === "" && isSubmitted}>
                  <FormLabel color="grey" fontWeight="bold">
                    Event Description
                  </FormLabel>
                  <Textarea
                    placeholder="Event Description"
                    value={desc}
                    onChange={handleDescChange}
                  />
                </FormControl>
              </Stack>

              <Stack spacing={0}>
                <FormControl isInvalid={type === "" && isSubmitted}>
                  <FormLabel color="grey" fontWeight="bold">
                    Event Type
                  </FormLabel>
                  <CreatableSelect
                    id="event-type"
                    options={eventTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    value={{ label: type, value: type }} // Set the initial value based on the current state
                    onChange={(option) => setType(option ? option.value : '')}
                    onCreateOption={(inputValue) => {
                      // This allows creating a new option that is not in the list
                      const newOptions = [...eventTypes, inputValue];
                      setEventTypes(newOptions);
                      setType(inputValue);
                    }}
                    chakraStyles={{
                      control: (provided) => ({
                        ...provided,
                        textAlign: "left",
                      }),
                    }}
                    isClearable
                    isSearchable
                  />
                </FormControl>
              </Stack>

              <Switch
                fontWeight="bold"
                color="grey"
                isChecked={vol}
                onChange={handleVolChange}
              >
                Volunteer Event
              </Switch>

              <Switch
                fontWeight="bold"
                color="grey"
                isDisabled={!vol}
                isFocusable={!vol}
                isChecked={myGrp}
                onChange={handleMyGrp}
              >
                Only My Group Allowed
              </Switch>

              <Switch
                fontWeight="bold"
                color="grey"
                isChecked={wc}
                onChange={handleWCChange}
              >
                Wheelchair Accessibility
              </Switch>

              <Switch
                fontWeight="bold"
                color="grey"
                isChecked={span}
                onChange={handleSpanChange}
              >
                Spanish Speaking Accommodations
              </Switch>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button onClick={HandleClose}>Close</Button>
            <Button onClick={HandleSubmit}>Confirm</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditEvent;
