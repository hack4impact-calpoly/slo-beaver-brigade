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
  VStack,
  HStack,
  Box,
  IconButton,
  Button as ChakraButton,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import { IEvent } from "@database/eventSchema";
import { Button } from "@styles/Button";
import styles from "@styles/admin/editEvent.module.css";
import React, { useState, useEffect } from "react";
import { CreatableSelect, Select } from "chakra-react-select";
import { useEventsAscending, useGroups } from "app/lib/swrfunctions";
import ImageSelector from "./ImageSelector";
import EventPreviewComponent from "@components/EventCard";
import { KeyedMutator } from "swr";
import { IGroup } from "database/groupSchema";
import { CreateTemporaryGroup } from "./ViewGroups";
import "../fonts/fonts.css";
import { useRef } from "react";
import { CheckIcon, EditIcon, AddIcon } from "@chakra-ui/icons";

const EditEvent = ({
  event,
  initialGroups,
  mutate,
}: {
  event: IEvent;
  initialGroups: IGroup[];
  mutate: KeyedMutator<IEvent>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // button open/close
  const { groups, isLoading, mutateGroups } = useGroups();

  const [name, setName] = useState(event.eventName);
  const [loc, setLoc] = useState(event.location);
  const [date, setDate] = useState(getDate(event.startTime));
  const [start, setStart] = useState(getTime(event.startTime));
  const [end, setEnd] = useState(getTime(event.endTime));
  const [desc, setDesc] = useState(event.description);
  const [type, setType] = useState(event.eventType);
  const [vol, setVol] = useState(event.volunteerEvent);
  const [myGrp, setMyGrp] = useState(event.groupsOnly);
  const [selectedGroups, setSelectedGroups] = useState<IGroup[]>(initialGroups);
  const [wc, setWC] = useState(event.wheelchairAccessible);
  const [span, setSpan] = useState(event.spanishSpeakingAccommodation);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [items, setItems] = useState<string[]>(event.checklist);
  const [newItem, setNewItem] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [preselected, setPreselected] = useState<boolean>(true);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    event.eventImage
  );

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
    if (!x) return "";
    let localeDate: string = x.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    let localeDateParts = localeDate.split("/");

    // Ensuring the array has all the required parts
    if (localeDateParts.length < 3) {
      console.error("Unexpected date format:", localeDate);
      return ""; // Return an empty string or a default date as fallback
    }

    let [month, day, year] = localeDateParts;

    return `${year}-${month}-${day}`;
  }

  function getTime(x: Date | null): string {
    if (!x) return "";
    let hours = x.getHours();
    let minutes = x.getMinutes();

    const pad = (num: number) => num.toString().padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}`;
  }

  function HandleSubmit() {
    const eventData = {
      eventName: name,
      eventType: type,
      eventImage: imagePreview,
      location: loc,
      description: desc,
      startTime: new Date(`${date}T${start}`),
      endTime: new Date(`${date}T${end}`),
      wheelchairAccessible: wc,
      spanishSpeakingAccommodation: span,
      volunteerEvent: vol,
      groupsAllowed: selectedGroups.flatMap((group) => group._id),
      groupsOnly: myGrp,
      registeredIds: event.registeredIds ? event.registeredIds : [],
      checklist: items,
    };

    console.log("Event Data:", eventData);

    fetch(`/api/events/${event._id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to update event");
        }
        setIsSubmitted(true);
        HandleClose();
        mutate((event) => {
          if (event) {
            return { ...event, ...data, checklist: items };
          }
          return event;
        });
      })
      .catch((error) => {
        console.error("Error editing event:", error);
      });
  }

  // Add new item
  const handleAddItem = () => {
    if (newItem.trim()) {
      setItems([...items, newItem]);
      setNewItem("");
    }
  };

  // Remove item
  const handleRemoveItem = (itemToRemove: string) => {
    setItems(items.filter((item) => item !== itemToRemove));
  };

  // Start editing
  const handleEditItem = (index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  };

  // Save edited item
  const handleSaveEdit = (index: number) => {
    if (editValue.trim()) {
      const newItems = [...items]; // Create new array
      newItems[index] = editValue;
      setItems(newItems); // Update state with new array
    }
    setEditingIndex(null);
    setEditValue("");
  };

  // Handle Enter key
  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (e.key === "Enter") {
      action();
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const promptFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection for the event cover image and set preview
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreselected(false);
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
      setCoverImage(file);
    }
  };

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

      <Modal isOpen={isOpen} onClose={HandleClose} size="lg">
        <ModalOverlay />
        <ModalContent fontFamily="Lato" borderRadius="10px">
          <ModalHeader
            bg="#337774"
            color="white"
            fontWeight="bold"
            position="relative"
            borderRadius="10px 10px 0px 0px"
          >
            Edit Event
          </ModalHeader>
          <ModalCloseButton
            cursor="pointer"
            color="white"
            size="l"
            marginTop="15px"
            marginRight="5px"
          />

          <ModalBody fontFamily="Lato" p={[5, 5, 5, 5]}>
            <Stack spacing={3}>
              <FormControl isInvalid={name === "" && isSubmitted}>
                <FormLabel color="black" fontWeight="bold">Event Name</FormLabel>
                <Input
                  placeholder=""
                  value={name}
                  onChange={handleNameChange}
                />
              </FormControl>

              <HStack width="100%" spacing={3}>
                <Flex
                  flexDir={{ base: "column", lg: "row" }}
                  flex="1"
                  gap={{ base: "10px", lg: "30px" }}
                  justifyContent="center"
                  mt={-4}
                  alignItems="center"
                >
                  <Flex
                    flex="1"
                    gap={{ base: "10px", lg: "30px" }}
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                  >
                    <FormControl
                      onClick={promptFileInput}
                      cursor="pointer"
                      width="100%"
                    >
                      <Input
                        id="cover-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        hidden // Hide the actual input
                      />
                      <Box
                        position="relative"
                        borderWidth="1px"
                        p="4"
                        mt="4"
                        textAlign="center"
                        h="64"
                        borderRadius="20px"
                        overflow="hidden"
                        width="100%"
                        bg="gray.200"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                      >
                        {!imagePreview ? (
                          <>
                            <Text>Upload Image</Text>
                            <IconButton
                              aria-label="Upload image"
                              icon={<AddIcon />}
                              mt="2"
                            />
                          </>
                        ) : (
                          <Image
                            src={imagePreview}
                            alt="Event cover preview"
                            position="absolute"
                            top={0}
                            left={0}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                            zIndex={0}
                          />
                        )}
                      </Box>
                    </FormControl>
                    <ImageSelector
                      setPreselected={setPreselected}
                      setImageURL={setImagePreview}
                    ></ImageSelector>
                  </Flex>
                </Flex>
              </HStack>

              <FormControl isInvalid={loc === "" && isSubmitted}>
                <FormLabel color="black" fontWeight="bold">Event Location</FormLabel>
                <Input
                  placeholder=""
                  value={loc}
                  onChange={handleLocationChange}
                />
              </FormControl>

              <Stack spacing={0}>
                <FormControl isInvalid={date === "" && isSubmitted}>
                  <FormLabel color="black" fontFamily="Lato" fontWeight="bold">
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
                  <FormLabel color="black" fontWeight="bold">
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
                  <FormLabel color="black" fontWeight="bold">
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
                  <FormLabel color="black" fontWeight="bold">
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
                  <FormLabel color="black" fontWeight="bold">
                    Event Type
                  </FormLabel>
                  <CreatableSelect
                    id="event-type"
                    options={eventTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    value={{ label: type, value: type }} // Set the initial value based on the current state
                    onChange={(option) => setType(option ? option.value : "")}
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
                <FormControl marginTop="1rem">
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
                    value={selectedGroups.map((group) => ({
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

                <FormControl marginTop="1rem">
                  <FormLabel htmlFor="required-items" fontWeight="bold">
                    Items to bring
                  </FormLabel>
                  <VStack spacing={4} align="flex-start">
                    <HStack spacing={4}>
                      <Input
                        id="new-item"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
                        placeholder="Enter item"
                      />
                      <ChakraButton
                        size={"sm"}
                        colorScheme="teal"
                        onClick={handleAddItem}
                      >
                        +
                      </ChakraButton>
                    </HStack>

                    {items?.length > 0 && (
                      <Box>
                        <Text fontWeight="bold">Items List:</Text>
                        <VStack spacing={2} align="flex-start">
                          {Array.isArray(items) &&
                            items.map((item, index) => (
                              <HStack
                                key={index}
                                spacing={2}
                                display={"flex"}
                                justifyContent={"space-around"}
                                w={"100%"}
                              >
                                {editingIndex === index ? (
                                  <Input
                                    size="sm"
                                    value={editValue}
                                    onChange={(e) =>
                                      setEditValue(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                      e.key === "Enter" && handleSaveEdit(index)
                                    }
                                    autoFocus
                                  />
                                ) : (
                                  <Box w={"100%"} textAlign="left">
                                    {item}
                                  </Box>
                                )}

                                <IconButton
                                  icon={
                                    editingIndex === index ? (
                                      <CheckIcon />
                                    ) : (
                                      <EditIcon />
                                    )
                                  }
                                  size="sm"
                                  colorScheme="yellow"
                                  onClick={() =>
                                    editingIndex === index
                                      ? handleSaveEdit(index)
                                      : handleEditItem(index, item)
                                  }
                                  aria-label="Edit item"
                                />

                                <ChakraButton
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() => handleRemoveItem(item)}
                                >
                                  x
                                </ChakraButton>
                              </HStack>
                            ))}
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </FormControl>

                {myGrp && groups && (
                  <div className="mt-3 mb-5 ">
                    <CreateTemporaryGroup
                      groups={selectedGroups}
                      mutate={mutateGroups}
                      setGroups={setSelectedGroups}
                    />
                  </div>
                )}
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
                isChecked={myGrp}
                onChange={handleMyGrp}
              >
                Only Available to Selected Groups
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
                Spanish Speaking
              </Switch>
            </Stack>
          </ModalBody>
          <ModalFooter
            justifyContent="center"
            bg="#337774"
            borderRadius="0px 0px 10px 10px"
          >
            <button
              className={`${styles.saveButton} ${styles.confirmationButton}`}
              onClick={HandleSubmit}
            >
              Save Changes
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditEvent;
