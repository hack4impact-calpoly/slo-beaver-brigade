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
  Image,
  Text,
  Flex,
  Select,
  Stack,
  Textarea,
  IconButton,

} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon} from "@chakra-ui/icons";
import MiniCalendar from "../../../components/MiniCalendar";
import { formatISO, parse } from 'date-fns';
import { useRouter } from "next/navigation";
import { uploadFileS3Bucket } from "app/actions/useractions";

// Define a type for groups to resolve '_id' does not exist on type 'never'
type Group = {
  _id: string;
  group_name: string;
};


export default function Page() {
  const toast = useToast();
  const router = useRouter()
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
  const [requiredItems, setRequiredItems] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [activeDate, setActiveDate] = useState("");

  const handleEventNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setEventName(e.target.value);

  const handleOrganizationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const groupId = e.target.value;
    const isChekced = e.target.checked;

    setOrganizationIds ((prevIds: string[]) => {
      if (isChekced){
        //add to list
        return [...prevIds,groupId]
      } else {
        //remove from list
        return prevIds.filter((id) => id != groupId);
      }
    });
  };

  //Parse and format start and end time from user input
  const handleTimeChange = (start: string, end: string) => {
    // Format for parsing input times (handle both 12-hour and 24-hour formats)
    const timeFormat = start.includes('AM') || start.includes('PM') ? "h:mm a" : "HH:mm";
    
    // Parse the start and end times as dates on the active date
    const parsedStartTime = parse(`${start}`, timeFormat, new Date(`${activeDate}T00:00:00`));
    const parsedEndTime = parse(`${end}`, timeFormat, new Date(`${activeDate}T00:00:00`));

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
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
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
    // Try to upload image
    const form = new FormData()
    const file = fileInputRef?.current?.files ?fileInputRef?.current?.files[0] : null 
    if (!file){
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
    form.append("file", file)
    const imageurl = await uploadFileS3Bucket(form)
    console.log(imageurl)

    const eventData = {
      eventName,
      eventType: "Beaver Walk",
      eventImage: imageurl,
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
    try{
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('HTTP error! status: $(response.status)')
      }

      const result = await response.json()
      console.log(result);

      toast({
        title: "Event Created",
        description: "Your event has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      router.push("/" + "admin/events")
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

  // Fetch groups data on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try{
        const response = await fetch ("/api/group")
        if (!response.ok) {
          throw new Error("Failed to fetch groups")
        }
        const data = await response.json()
        setGroups(data)
      } catch (error){
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
                onChange={(e) => setEventType(e.target.value)}
              >
                <option value="Watery Walk">Watery Walk</option>
                <option value="Volunteer">Volunteer</option>
              </Select>
            </FormControl>
          
            <FormControl width="48%">
              <FormLabel htmlFor="organization" fontWeight="bold">
                Organization
              </FormLabel>
              <Menu closeOnSelect={false}>
                  <MenuButton 
                    as={Button} 
                    rightIcon={<ChevronDownIcon/> }
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
              <option >Yes</option>
              <option >No</option>
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
              <option >Yes</option>
              <option >No</option>
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
            <MiniCalendar onTimeChange={(start, end) => handleTimeChange(start, end)}
            onDateChange={(date) => handleDateChangeFromCalendar(date)} />
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
