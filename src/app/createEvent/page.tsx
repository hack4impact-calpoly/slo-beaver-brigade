"use client";
import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Image,
  Text,
  InputLeftElement,
  InputGroup,
  Flex,
  Select,
  Textarea,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import MiniCalendar from "../components/MiniCalendar";

const CreateEvent = () => {
  const toast = useToast();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [coverImage, setCoverImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [eventType, setEventType] = useState("");
  const [organization, setOrganization] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [accessibilityAccommodation, setAccessibilityAccommodation] =
    useState("");
  const [requiredItems, setRequiredItems] = useState("");

  const handleEventNameChange = (e) => setEventName(e.target.value);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setCoverImage(file);
    }
  };

  const fileInputRef = useRef(null); // Create a ref for the file input

  // Adjust handleImageChange to automatically click the file input when the box is clicked
  const promptFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCreateEvent = async () => {
    if (!eventName) {
      toast({
        title: "Error",
        description: "Event name can't be empty.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Event Created",
      description: "Your event has been successfully created.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
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
          {/* All your form controls */}
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
          {/*<FormControl>
            <FormLabel htmlFor="event-date">Event Date/Time</FormLabel>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<CalendarIcon />} />
              <Input
                id="event-date"
                type="datetime-local"
                onChange={(e) => setEventDate(new Date(e.target.value))}
              />
            </InputGroup>
            </FormControl>*/}

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
                {/* Populate with options */}
                <option value="Watery Walk">Watery Walk</option>
                <option value="Volunteer">Volunteer</option>
              </Select>
            </FormControl>

            <FormControl isRequired width="48%">
              <FormLabel htmlFor="organization" fontWeight="bold">
                Organization
              </FormLabel>
              <Select
                id="organization-type"
                placeholder="Select"
                onChange={(e) => setOrganization(e.target.value)}
              >
                {/* Populate with options */}
                <option value="Watery Walk">I dont know</option>
                <option value="Volunteer">I dont know</option>
              </Select>
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
            <FormLabel htmlFor="language" fontWeight="bold">
              Language
            </FormLabel>
            <Select
              id="language-type"
              placeholder="Select"
              onChange={(e) => setLanguage(e.target.value)}
            >
              {/* Populate with options */}
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
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
            <FormLabel htmlFor="accessibility" fontWeight="bold">
              Accessibility Accommodation
            </FormLabel>
            <Input
              id="accessibility"
              placeholder="Enter accessibility accommodation"
              onChange={(e) => setAccessibilityAccommodation(e.target.value)}
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
          <MiniCalendar />
        </Box>
      </Flex>
      <Box display="flex" justifyContent="center" mt={4}>
        <Button
          colorScheme="blue"
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