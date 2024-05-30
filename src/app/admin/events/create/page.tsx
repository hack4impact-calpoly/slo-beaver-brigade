"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  HStack,
  Image,
  Text,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import EventPreviewComponent from "@components/EventCard";
import MiniCalendar from "../../../components/MiniCalendar";
import { formatISO, parse, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { uploadFileS3Bucket } from "app/lib/clientActions";
import { Select, CreatableSelect } from "chakra-react-select";
import MDEditor from "@uiw/react-md-editor";
import style from "@styles/calendar/calendar.module.css";
import ImageSelector from "app/components/ImageSelector";
import { useEventsAscending } from "app/lib/swrfunctions";

// Define a type for groups to resolve '_id' does not exist on type 'never'
type Group = {
  _id: string;
  group_name: string;
};

const Page: React.FC = () => {
  const { mutate } = useEventsAscending();
  const toast = useToast();
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [eventType, setEventType] = useState("");
  const [organizationIds, setOrganizationIds] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [preselected, setPreselected] = useState<boolean>(false);
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("Yes");
  const [description, setDescription] = useState("");
  const [accessibilityAccommodation, setAccessibilityAccommodation] = useState("Yes");
  const [checkList, setChecklist] = useState("N/A");
  const [eventStart, setEventStart] = useState<string | null>(null);
  const [eventEnd, setEventEnd] = useState<string | null>(null);
  const [activeDate, setActiveDate] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEventName(e.target.value);

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const groupId = e.target.value;
    const isChecked = e.target.checked;

    setOrganizationIds((prevIds: string[]) => {
      if (isChecked) {
        return [...prevIds, groupId];
      } else {
        return prevIds.filter((id) => id !== groupId);
      }
    });
  };

  const handleTimeChange = (start: string, end: string) => {
    if (start && end) {
      const timeFormat = start.includes("AM") || start.includes("PM") ? "h:mm a" : "HH:mm";
      const parsedStartTime = parse(`${start}`, timeFormat, new Date(`${activeDate}T00:00:00`));
      const parsedEndTime = parse(`${end}`, timeFormat, new Date(`${activeDate}T00:00:00`));

      const formattedStartDateTime = formatISO(parsedStartTime);
      const formattedEndDateTime = formatISO(parsedEndTime);

      setEventStart(formattedStartDateTime);
      setEventEnd(formattedEndDateTime);
    }
    if (!start) {
      setEventStart(null);
    }
    if (!end) {
      setEventEnd(null);
    }
  };

  const handleDateChangeFromCalendar = (newDate: string) => {
    setActiveDate(newDate);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const promptFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

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

  const handleCreateEvent = async () => {
    if (
      !eventName ||
      !eventType ||
      !accessibilityAccommodation ||
      !location ||
      !description
    ) {
      toast({
        title: "Error",
        description: "Event details are not complete",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    } else if (
      eventStart === null || eventEnd === null || activeDate === ""
    ) {
      toast({
        title: "Error",
        description: "Event date and time are not set",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    } else if (
      new Date(eventEnd) < new Date(eventStart)
    ) {
      toast({
        title: "Error",
        description: "End time is before start time",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    const file = fileInputRef?.current?.files?.[0] ?? null;
    let imageurl = null;
    if (file || preselected) {
      if (!preselected) {
        imageurl = await uploadFileS3Bucket(file);
        if (!imageurl) {
          console.error("Failed to create the event: image upload.");
          toast({
            title: "Error",
            description: "Failed to create the event",
            status: "error",
            duration: 2500,
            isClosable: true,
          });
          return;
        }
      } else {
        imageurl = imagePreview;
      }
    }

    const eventData = {
      eventName,
      ...(imageurl && { eventImage: imageurl }),
      eventType,
      checklist: checkList,
      location,
      description,
      wheelchairAccessible: accessibilityAccommodation === "Yes",
      spanishSpeakingAccommodation: language === "Yes",
      startTime: new Date(eventStart),
      endTime: new Date(eventEnd),
      volunteerEvent: eventType === "Volunteer",
      groupsAllowed: organizationIds,
    };

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      mutate();
      toast({
        title: "Event Created",
        description: "Your event has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/" + "admin/events");
    } catch (error) {
      console.error("Failed to create the event:", error);
      toast({
        title: "Error",
        description: "Failed to create the event",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
    }
  };

  const handleCreateNewGroup = async (groupName: string) => {
    const groupData = {
      group_name: groupName,
      groupees: [],
    };

    const optimisticNewGroup = {
      _id: Date.now().toString(),
      group_name: groupName,
    };

    setGroups((currentGroups) => [...currentGroups, optimisticNewGroup]);

    try {
      const response = await fetch("/api/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(groupData),
      });
      if (!response.ok) {
        setGroups((currentGroups) =>
          currentGroups.filter((group) => group._id !== optimisticNewGroup._id)
        );
        throw new Error("Failed to create group");
      }
      const newGroup = await response.json();
      setGroups((currentGroups) =>
        currentGroups.map((group) =>
          group._id === optimisticNewGroup._id
            ? { ...group, _id: newGroup._id }
            : group
        )
      );
      toast({
        title: "Group Created",
        description: "The new group has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to Create Group",
        description: "Failed to Create Group",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch("/api/group");
        if (!response.ok) {
          throw new Error("Failed to fetch groups");
        }
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch groups",
          status: "error",
          duration: 2500,
          isClosable: true,
        });
      }
    };
    fetchGroups();
  }, [toast]);

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

  const mockEvent = {
    _id: "mockId",
    eventName,
    eventImage: imagePreview,
    eventType,
    checklist: checkList,
    location,
    description,
    wheelchairAccessible: accessibilityAccommodation === "Yes",
    spanishSpeakingAccommodation: language === "Yes",
    startTime: eventStart ? parseISO(eventStart) : new Date(),
    endTime: eventEnd ? parseISO(eventEnd) : new Date(),
    volunteerEvent: eventType === "Volunteer",
    groupsAllowed: organizationIds,
    registeredIds: [],
    attendeeIds: [],
  };

  const groupNames: Record<string, string> = {};
  groups.forEach(group => {
    groupNames[group._id] = group.group_name;
  });

  return (
    <Box p={8} mx="10">
      <Text fontSize="2xl" fontWeight="bold" color="black" mt={-12} mb={3}>
        Create New Event
      </Text>

      <Flex direction={{ base: "column", md: "row" }} gap={10} mb={6}> 
        <Box>
          <VStack alignItems="flex-start" mb={4} width={{ base: "100%", md: "30%" }}>
            <Box>
              <Text fontWeight="bold" textAlign="left" mb="2">Event Preview</Text>
              <VStack alignContent="center">
              <EventPreviewComponent
                event={mockEvent}
                groupName={groups.find((group) => group._id === organizationIds[0])?.group_name || ""}
                onClick={() => {}}
              />
              <HStack width="100%">
                <FormControl
                  onClick={promptFileInput}
                  cursor="pointer"
                  width="50%"
                >
                  <Input
                    id="cover-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    hidden
                  />
                  <Box
                    position="relative"
                    borderWidth="1px"
                    p="4"
                    textAlign="center"
                    h="32"
                    mt="2"
                    borderRadius="10px"
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
                        <IconButton aria-label="Upload image" icon={<AddIcon />} mt="2" />
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
                <ImageSelector width="50%" h="32" mt="2" borderRadius="10px" setPreselected={setPreselected} setImageURL={setImagePreview}/>
              </HStack>
              
              <Text fontWeight="bold" mt="5" textAlign="left">
                Date/Time
              </Text>
              <Flex justifyContent="center">
                <FormControl isRequired>
                  <MiniCalendar
                    onTimeChange={(start, end) => handleTimeChange(start, end)}
                    onDateChange={(date) => handleDateChangeFromCalendar(date)}
                  />
                </FormControl>
              </Flex>
              </VStack>
            </Box>
          </VStack>
        </Box>
        
        <Flex flex="1" direction="column" gap={4}>
          <FormControl isRequired>
            <FormLabel htmlFor="event-name" fontWeight="bold">
              Event Name
            </FormLabel>
            <Input
              id="event-name"
              placeholder="Enter event name"
              onChange={handleEventNameChange}
            />
          </FormControl>

          <HStack justifyContent="space-between">
            <FormControl width="48%">
              <FormLabel htmlFor="event-type" fontWeight="bold">
                Event Type
              </FormLabel>
              <CreatableSelect
                id="event-type"
                placeholder="Select or create event type"
                options={eventTypes.map((type) => ({
                  value: type,
                  label: type,
                }))}
                onChange={(option) => {
                  setEventType(option ? option.value : "");
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

            <FormControl width="48%">
              <FormLabel htmlFor="organization" fontWeight="bold">
                Organization
              </FormLabel>
              <CreatableSelect
                id="organization"
                placeholder="Select or create organization"
                options={groups.map((group) => ({
                  value: group._id,
                  label: group.group_name,
                }))}
                onChange={(selectedOptions) =>
                  setOrganizationIds(
                    selectedOptions
                      ? selectedOptions.map((option) => option.value)
                      : []
                  )
                }
                onCreateOption={handleCreateNewGroup}
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
          </HStack>

          <FormControl isRequired>
            <FormLabel htmlFor="location" fontWeight="bold">
              Location
            </FormLabel>
            <Input
              id="location"
              placeholder="Enter event location"
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="spanishAccommodation" fontWeight="bold">
              Spanish Speaking Accommodation
            </FormLabel>
            <Select
              id="accommodation-type"
              placeholder="Select"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              defaultInputValue="Yes"
              onChange={(option) => setLanguage(option ? option.value : " ")}
              chakraStyles={{
                control: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
              }}
            ></Select>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="accessibility" fontWeight="bold">
              Accessibility Accommodation
            </FormLabel>
            <Select
              id="accessibility"
              placeholder="Select"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
              defaultInputValue="Yes"
              onChange={(option) =>
                setAccessibilityAccommodation(option ? option.value : " ")
              }
              chakraStyles={{
                control: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="description" fontWeight="bold">
              Description
            </FormLabel>
            <MDEditor className={style.preview} value={description} onChange={(e) => setDescription(e || "")} data-color-mode="light"/>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="required-items" fontWeight="bold">
              Checklist
            </FormLabel>
            <MDEditor className={style.preview} value={checkList} onChange={(e) => setChecklist(e || "")} data-color-mode="light"/>
          </FormControl>
        </Flex>
      </Flex>

      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          colorScheme="yellow"
          onClick={handleCreateEvent}
          minWidth="150px"
          width="20%"
        >
          Create Event
        </Button>
      </Box>
    </Box>
  );
}

export default Page;
