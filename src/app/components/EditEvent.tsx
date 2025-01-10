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
import { CreatableSelect, Select } from "chakra-react-select";
import { useEventsAscending, useGroups } from "app/lib/swrfunctions";
import { KeyedMutator } from "swr";
import { IGroup } from "database/groupSchema";
import { CreateTemporaryGroup } from "./ViewGroups";
import "../fonts/fonts.css";

const EditEvent = ({event, initialGroups, mutate}: {event: IEvent, initialGroups: IGroup[], mutate: KeyedMutator<IEvent>}) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // button open/close
    const {groups, isLoading, mutateGroups} = useGroups()

  const [name, setName] = useState(event.eventName);
  const [loc, setLoc] = useState(event.location);
  const [date, setDate] = useState(getDate(event.startTime));
  const [start, setStart] = useState(getTime(event.startTime));
  const [end, setEnd] = useState(getTime(event.endTime));
  const [desc, setDesc] = useState(event.description);
  const [type, setType] = useState(event.eventType);
  const [vol, setVol] = useState(event.volunteerEvent);
  const [myGrp, setMyGrp] = useState(event.groupsOnly);
  const [selectedGroups, setSelectedGroups] = useState<IGroup[]>(initialGroups)
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
  };
  const handleMyGrp = () => setMyGrp(!myGrp);
  const handleWCChange = () => setWC(!wc);
  const handleSpanChange = () => setSpan(!span);

  const [isSubmitted, setIsSubmitted] = useState(false);

  function HandleClose() {
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
    let hours = x.getHours();
    let minutes = x.getMinutes();
    
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    return `${pad(hours)}:${pad(minutes)}`;
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
      groupsAllowed: selectedGroups.flatMap(group => group._id),
      groupsOnly: myGrp,
      registeredIds: event.registeredIds ? event.registeredIds : [],
    };

    
    fetch(`/api/events/${event._id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then((response) => response.text()) // Parsing JSON response
      .then((text) => {
        
        const data = text.startsWith("Event updated:")
          ? JSON.parse(text.substring("Event updated: ".length))
          : {};
        setIsSubmitted(true);
        HandleClose();
        mutate((event) => {
            if (event){
                return {...event, ...eventData}
            }
            return event
        })
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
        <ModalContent fontFamily="Lato" borderRadius="10px">
          <ModalHeader bg="#337774" color="white" fontWeight="bold" position="relative" borderRadius="10px 10px 0px 0px">
            Edit Event
          </ModalHeader>
          <ModalCloseButton cursor="pointer" color="white" size="l" marginTop= "15px" marginRight="5px" />

          <ModalBody>
            <Stack spacing={3}>
              <FormControl isInvalid={name === "" && isSubmitted}>
                <FormLabel color="grey" fontWeight="bold">Event Name</FormLabel>
                <Input
                  placeholder=""
                  fontWeight="bold"
                  value={name}
                  onChange={handleNameChange}
                />
              </FormControl>

              <FormControl isInvalid={loc === "" && isSubmitted}>
                <FormLabel color="grey" fontWeight="bold">Event Location</FormLabel>
                <Input
                  placeholder=""
                  fontWeight="bold"
                  value={loc}
                  onChange={handleLocationChange}
                />
              </FormControl>

              <Stack spacing={0}>
                <FormControl isInvalid={date === "" && isSubmitted}>
                  <FormLabel color="grey" fontFamily="Lato" fontWeight="bold">
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
            <FormControl marginTop='1rem'>
              <FormLabel htmlFor="organization" fontWeight="bold">
                Groups
              </FormLabel>
              <Select
                id="organization"
                placeholder="Select groups."
                options={groups?.map((group) => ({
                  value: group,
                  label: group.group_name,
                }))}
                value={selectedGroups.map(group => ({
                    value: group,
                    label: group.group_name,
                }))}
                onChange={(selectedOptions) =>
                  setSelectedGroups(
                    selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : []
                  )
                }
                chakraStyles={{
                  control: (provided) => ({
                    ...provided,
                    textAlign: "left",
                  }),
                }}
                isMulti
                isClearable
                isSearchable
              />
            </FormControl>
        {myGrp && groups && <div className="mt-3 mb-5 ">
          <CreateTemporaryGroup groups={selectedGroups} mutate={mutateGroups} setGroups={setSelectedGroups}/>
            </div>}
              </Stack>

              {/* Commenting out because redundant; using eventType prop instead
              <Switch
                fontWeight="bold"
                color="grey"
                isChecked={vol}
                onChange={handleVolChange}
              >
                Volunteer Event
              </Switch>
              */}    
              <Switch
                fontWeight="bold"
                color="grey"
                isChecked={myGrp}
                onChange={handleMyGrp}
              >
                Groups Only
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
