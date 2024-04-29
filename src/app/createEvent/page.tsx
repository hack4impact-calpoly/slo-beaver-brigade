"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  Image,
  Text,
  Flex,
  Select,
  Stack,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon } from "@chakra-ui/icons";
import MiniCalendar from "../components/MiniCalendar";
import { formatISO, parse } from "date-fns";

// Define a type for groups to resolve '_id' does not exist on type 'never'
type Group = {
  _id: string;
  group_name: string;
};


const CreateEvent = () => {
  const predefinedEventTypes = ['Volunteer', 'Beaver Walk', 'Pond Clean Up'];
  const toast = useToast();
  const [eventName, setEventName] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [eventTypes, setEventTypes] = useState(predefinedEventTypes);
  const [organizationIds, setOrganizationIds] = useState<string[]>([]);
  // Specify type for group to avoid error
  const [groups, setGroups] = useState<Group[]>([]);
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [accessibilityAccommodation, setAccessibilityAccommodation] =
    useState("");
  const [requiredItems, setRequiredItems] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [activeDate, setActiveDate] = useState("");

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

  //Parse and format start and end time from user input
  const handleTimeChange = (start: string, end: string) => {
    // Format for parsing input times (handle both 12-hour and 24-hour formats)
    const timeFormat =
      start.includes("AM") || start.includes("PM") ? "h:mm a" : "HH:mm";

    // Parse the start and end times as dates on the active date
    const parsedStartTime = parse(
      `${start}`,
      timeFormat,
      new Date(`${activeDate}T00:00:00`)
    );
    const parsedEndTime = parse(
      `${end}`,
      timeFormat,
      new Date(`${activeDate}T00:00:00`)
    );

    // Format the adjusted dates back into ISO strings
    const formattedStartDateTime = formatISO(parsedStartTime);
    const formattedEndDateTime = formatISO(parsedEndTime);

    // Update the state with the formatted date times
    setEventStart(formattedStartDateTime);
    setEventEnd(formattedEndDateTime);
  };

  // Update active date upon change from MiniCalendar
  const handleDateChangeFromCalendar = (newDate: string) => {
    setActiveDate(newDate);
  };

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger file input click for image upload
  const promptFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection for the event cover image and set preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      !selectedEventType ||
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

    const eventData = {
      eventName,
      location,
      description,
      wheelchairAccessible: accessibilityAccommodation === "Yes",
      spanishSpeakingAccommodation: language === "Yes",
      startTime: eventStart,
      endTime: eventEnd,
      eventType: selectedEventType,
      volunteerEvent: selectedEventType === "Volunteer",
      groupsAllowed: organizationIds,
      attendeeIds: [],
      registeredIds: [],
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

  useEffect(() => {
    fetchEventTypes();
    fetchGroups();
  }, []);

  // Fetch groups data on component mount
  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/group");
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


  const fetchEventTypes = async () => {
    try {
      const response = await fetch('/api/events/bytype/eventType');
      const fetchedEventTypes = await response.json();
      // Filter out any fetched types that are already predefined
      const uniqueFetchedTypes = fetchedEventTypes.filter((type: string) => !predefinedEventTypes.includes(type));
      // Combine predefined with unique fetched types
      setEventTypes([...predefinedEventTypes, ...uniqueFetchedTypes]);
    } catch (error) {
      toast({
        title: "Error fetching event types",
        description: "Error fetching event types",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8} mx="10">
      <Text fontSize="2xl" fontWeight="bold" color="black" mb={3}>
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

          <Flex justifyContent="space-between" width="100%">
            <FormControl isRequired width="48%">
              <FormLabel htmlFor="event-type" fontWeight="bold">
                Event Type
              </FormLabel>
              <Select
                id="event-type"
                placeholder="Select"
                onChange={(e) => setSelectedEventType(e.target.value)}
                value={selectedEventType}
              >
                {eventTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
              </Select>
            </FormControl>

            <FormControl width="48%">
              <FormLabel htmlFor="organization" fontWeight="bold">
                Organization
              </FormLabel>
              <Menu closeOnSelect={false}>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  fontWeight="normal"
                  bg="white"
                  borderColor="gray.300"
                  borderWidth="1px"
                >
                  Select Organization
                </MenuButton>
                <MenuList>
                  <Stack pl={4} pr={4}>
                    {groups.map((group) => (
                      <Checkbox
                        key={group._id}
                        value={group._id}
                        isChecked={organizationIds.includes(group._id)}
                        onChange={handleOrganizationChange}
                      >
                        {group.group_name}
                      </Checkbox>
                    ))}
                  </Stack>
                </MenuList>
              </Menu>
            </FormControl>
          </Flex>

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
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>Yes</option>
              <option>No</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel htmlFor="accessibility" fontWeight="bold">
              Accessibility Accommodation
            </FormLabel>
            <Select
              id="accessibility"
              placeholder="Select"
              onChange={(e) => setAccessibilityAccommodation(e.target.value)}
            >
              <option>Yes</option>
              <option>No</option>
            </Select>
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
              Required Items
            </FormLabel>
            <Input
              id="required-items"
              placeholder="Enter required items"
              onChange={(e) => setRequiredItems(e.target.value)}
            />
          </FormControl>
        </VStack>
        <Box flex="1">
          <Text fontWeight="bold" ml={4}>
            Date/Time
          </Text>
          {/* MiniCalendar */}
          <FormControl isRequired>
            <MiniCalendar
              onTimeChange={(start, end) => handleTimeChange(start, end)}
              onDateChange={(date) => handleDateChangeFromCalendar(date)}
            />
          </FormControl>
        </Box>
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
};

export default CreateEvent;
