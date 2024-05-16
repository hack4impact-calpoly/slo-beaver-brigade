"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  HStack,
  Image,
  Text,
  Flex,
  Stack,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import MiniCalendar from "../../../components/MiniCalendar";
import { formatISO, parse } from "date-fns";
import { useRouter } from "next/navigation";
import { uploadFileS3Bucket } from "app/lib/clientActions";
import { Select, CreatableSelect } from "chakra-react-select";
import styles from "../../../styles/userdashboard/MiniCalendar.module.css";


// Define a type for groups to resolve '_id' does not exist on type 'never'
type Group = {
  _id: string;
  group_name: string;
};

export default function Page() {
  const toast = useToast();
  const router = useRouter();
  const [eventName, setEventName] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [eventType, setEventType] = useState("");
  const [organizationIds, setOrganizationIds] = useState<string[]>([]);
  // Specify type for group to avoid error
  const [groups, setGroups] = useState<Group[]>([]);
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [accessibilityAccommodation, setAccessibilityAccommodation] =
    useState("");
  const [checkList, setChecklist] = useState("N/A");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [activeDate, setActiveDate] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEventName(e.target.value);

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const groupId = e.target.value;
    const isChekced = e.target.checked;

    setOrganizationIds((prevIds: string[]) => {
      if (isChekced) {
        //add to list
        return [...prevIds, groupId];
      } else {
        //remove from list
        return prevIds.filter((id) => id != groupId);
      }
    });
  };

  const handleTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const value = event.target.value;
    if (type === "start") {
      setEventStart(value);
    } else {
      setEventEnd(value);
  }
  };

  //Parse and format start and end time from user input
  // const handleTimeChange = (start: string, end: string) => {
  //   // Format for parsing input times (handle both 12-hour and 24-hour formats)
  //   if(start && end){
  //     const timeFormat =
  //     start.includes("AM") || start.includes("PM") ? "h:mm a" : "HH:mm";

  //     // Parse the start and end times as dates on the active date
  //     const parsedStartTime = parse(
  //       `${start}`,
  //       timeFormat,
  //       new Date(`${activeDate}T00:00:00`)
  //     );
  //     const parsedEndTime = parse(
  //       `${end}`,
  //       timeFormat,
  //       new Date(`${activeDate}T00:00:00`)
  //     );
        
  //     // Format the adjusted dates back into ISO strings
  //     const formattedStartDateTime = formatISO(parsedStartTime);
  //     const formattedEndDateTime = formatISO(parsedEndTime);
  //     // Update the state with the formatted date times
  //     setEventStart(formattedStartDateTime);
  //     setEventEnd(formattedEndDateTime);
  //   };
  //   if(!start){
  //     setEventStart("");
  //   };
  //   if(!end){
  //     setEventEnd("");
  //   };
  // };
  // // Update active date upon change from MiniCalendar
  // const handleDateChangeFromCalendar = (newDate: string) => {
  //   setActiveDate(newDate);
  // };

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger file input click for image upload
  const promptFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection for the event cover image and set preview
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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


  // Throw a Toast when event details are not complete and makes a post request to create event if details are complete
  const handleCreateEvent = async () => {
    // Form validation before submission
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
    }
    else if (
      eventStart === "" || eventEnd === "" || activeDate === ""
    ){
      toast({
        title: "Error",
        description: "Event date and time are not set",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }
    else if(
      eventEnd < eventStart
    ){
      toast({
        title: "Error",
        description: "End time is before start time",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    // Try to upload image
    const file = fileInputRef?.current?.files?.[0] ?? null;
    let imageurl = null;

    if (file) {
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
      }    }

    const eventData = {
      eventName,
      ...(imageurl && { eventImage: imageurl }),
      eventType,
      checkList: checkList,
      location,
      description,
      wheelchairAccessible: accessibilityAccommodation === "Yes",
      spanishSpeakingAccommodation: language === "Yes",
      startTime: eventStart,
      endTime: eventEnd,
      volunteerEvent: eventType === "Volunteer",
      groupsAllowed: organizationIds,
    };

    // Attempt to create event via API and handle response
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("HTTP error! status: $(response.status)");
      }

      const result = await response.json();

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

    // Optimistically update UI
    const optimisticNewGroup = {
      _id: Date.now().toString(), // Temporary ID
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
        // Rollback if the creation failed
        setGroups((currentGroups) =>
          currentGroups.filter((group) => group._id !== optimisticNewGroup._id)
        );
        throw new Error("Failed to create group");
      }
      const newGroup = await response.json();
      // Update the temporary group with actual _id from the response
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

  // Fetch groups data on component mount
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

  // Fetching different event types
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

  
  
  return (
    <Box p={8} mx="10">
      <Text fontSize="2xl" fontWeight="bold" color="black" mt={-12} mb={3}>
        Create New Event
      </Text>
      <FormControl mb="4" onClick={promptFileInput} cursor="pointer">
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
              objectFit="fill"
              zIndex={0}
            />
          )}
        </Box>
      </FormControl>

      <Flex direction={{ base: "column", md: "row" }} gap={20} mb={6}>
        <VStack spacing={4} align="stretch" flex="1">
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
            <FormControl isRequired width="48%">
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
                  console.log(option);
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

          <FormControl isRequired>
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
              onChange={(option) => setLanguage(option ? option.value : " ")}
              chakraStyles={{
                control: (provided) => ({
                  ...provided,
                  textAlign: "left",
                }),
              }}
            ></Select>
          </FormControl>

          <FormControl isRequired>
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
            <Textarea
              id="description"
              placeholder="Enter event description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="required-items" fontWeight="bold">
              Checklist
            </FormLabel>
            <Textarea
              id="required-items"
              placeholder="Enter checklist."
              onChange={(e) => setChecklist(e.target.value)}
            />
          </FormControl>
        </VStack>
        <Flex flex="1">
          <VStack alignItems="flex-start">
            <Text fontWeight="bold" mb="-4">
              Date/Time
            </Text>
            {/* MiniCalendar */}
            <FormControl ml="-4" isRequired>
              {/* <MiniCalendar
                onTimeChange={(start, end) => handleTimeChange(start, end)}
                onDateChange={(date) => handleDateChangeFromCalendar(date)}
              /> */}
              <div className={styles.timeSelector}>
                <div>
                  &nbsp;&nbsp;Date :{" "}
                  <input
                    type="date"
                    className={styles.timeInput}
                    value={activeDate}
                    onChange={(e) => setActiveDate(e.target.value)}
                  />
                </div>
                <div>
                  Start Time :{" "}
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={eventStart}
                    onChange={(e) => handleTimeChange(e, "start")}
                  />
                </div>
                <div>
                  &nbsp;&nbsp;End Time :{" "}
                  <input
                    type="time"
                    className={styles.timeInput}
                    value={eventEnd}
                    onChange={(e) => handleTimeChange(e, "end")}
                 />
                </div>
              </div>
            </FormControl>
          </VStack>
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
