"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Heading,
  Select,
  Stack,
  Text,
  useStatStyles,
  Flex,
  Spacer,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import Slider from "react-slick";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { url } from "inspector";
import Image from "next/image";
import { IUser } from "@database/userSchema";

const EventPlaceholder = () => {
  return (
    <Box
      borderWidth="1px"
      p="4"
      mb="4"
      h="60"
      textAlign="left"
      opacity="0" // Invisible but maintains layout; adjust as needed
    >
      {/* Placeholder content if desired */}
    </Box>
  );
};

const Dashboard = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [userEvents, setUserEvents] = useState([]);
  const [unregisteredEvents, setUnregisteredEvents] = useState([]);

  const eventNameSize = useBreakpointValue({ base: "lg", md: "xl", lg: "2xl" });
  const eventDetailSize = useBreakpointValue({
    base: "md",
    md: "lg",
    lg: "xl",
  });
  const eventTimeSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const marginBottom = useBreakpointValue({
    base: "5vh",
    md: "8vh",
    lg: "8vh",
  });

  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert to Date object if not already
    }

    const options = { weekday: "long", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatDateTimeRange = (start, end) => {
    if (!(start instanceof Date)) {
      start = new Date(start); // Convert to Date object if not already
    }

    if (!(end instanceof Date)) {
      end = new Date(end); // Convert to Date object if not already
    }

    const options = {
      hour: "numeric",
      minute: "numeric",
    };

    const formattedStart = start.toLocaleTimeString("en-US", options);
    const formattedEnd = end.toLocaleTimeString("en-US", options);

    return `${formattedStart} - ${formattedEnd}`;
  };

  useEffect(() => {
    const fetchUserDataAndEvents = async () => {
      try {
        if (isSignedIn) {
          const userId = user.unsafeMetadata["dbId"]; // Assuming this is the correct ID to match against event attendees

          // Fetch all events
          const eventsResponse = await fetch("/api/events");
          if (!eventsResponse.ok) {
            throw new Error(
              `Failed to fetch events: ${eventsResponse.statusText}`
            );
          }
          const allEvents = await eventsResponse.json();
          const currentDate = new Date();

          // Filter events where the current user is an attendee
          const userSignedUpEvents = allEvents.filter((event) =>
            event.attendeeIds.includes(userId) && new Date(event.startTime) >= currentDate
          );
          const eventsUserHasntRegistered = allEvents
            .filter((event) => !event.attendeeIds.includes(userId) && new Date(event.startTime) >= currentDate)
            .slice(0, 2); // Get first two events user hasn't registered for
          // Update state with events the user has signed up for
          setUserEvents(userSignedUpEvents);
          setUnregisteredEvents(eventsUserHasntRegistered);
          console.log(eventsUserHasntRegistered);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the function to fetch user data and events
    fetchUserDataAndEvents();
  }, [isSignedIn, user]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const adjustedSettings = {
    ...settings,
    slidesToShow: Math.min(userEvents.length, 3), // Show up to 3 slides, or less if there aren't enough events
    infinite: userEvents.length > 3, // Only enable infinite looping if there are more than 3 events
  };

  return (
    <Box p="4">
      <Stack spacing={2} px="10" mb={6}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="bold" color="grey" mb={3}>
            Your Upcoming Events
          </Text>
          <Button colorScheme="teal">Book Event</Button>
        </Flex>
        <Divider
          size="sm"
          borderWidth="1px"
          borderColor="black"
          alignSelf="center"
          w="100%"
        />
      </Stack>
      <Box px={6}>
        <Slider {...settings}>
          {userEvents.length > 0 ? (
            userEvents.map((event) => (
              <Box key={event._id} textAlign="center" px="4" mb="4">
                <Box
                  position="relative"
                  borderWidth="1px"
                  p="4"
                  mb="4"
                  h="60"
                  textAlign="left"
                  borderRadius="lg"
                  style={{
                    //backgroundImage: `url(${event.imageUrl || '/default-event-image.jpg'})`,
                    backgroundImage: `url("/underwater-saltwater-beavers.jpg")`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                >
                  <Text
                    fontSize={eventNameSize}
                    fontWeight="bold"
                    color="white"
                    className="bold-text"
                    //mb={marginBottom}
                    mx={2}
                  >
                    {event.eventName}
                  </Text>
                  <Box position="absolute"
                    bottom="0"
                    left="0"
                    right="0"
                    p={2}
                    mx="2"
                    my="2">
                    <Text
                      fontSize={eventDetailSize}
                      fontWeight="bold"
                      color="white"
                      className="bold-text"
                      mx={2}
                      alignContent="left-bottom"
                    >
                      {formatDate(event.startTime)}
                    </Text>
                    <Text
                      fontSize={eventTimeSize}
                      fontWeight="semibold"
                      color="white"
                      className="bold-text"
                      mx={2}
                      alignContent="left-bottom"
                    >
                      {event.location}
                    </Text>
                    <Text
                      fontSize={eventTimeSize}
                      fontWeight="semibold"
                      color="white"
                      className="bold-text"
                      mx={2}
                      alignContent="left-bottom"
                    >
                      {formatDateTimeRange(event.startTime, event.endTime)}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <EventPlaceholder />
          )}
          {userEvents.length < 3 &&
            Array.from({ length: 3 - userEvents.length }, (_, i) => (
              <EventPlaceholder key={`placeholder-${i}`} />
            ))}
        </Slider>
      </Box>
      {/* Re-include the omitted bottom section here */}
      <Box px="10" mb={6}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="bold" color="grey" mb={3}>
            Find More Volunteer Opportunities
          </Text>
          <Select defaultValue="event-type" size="sm" ml={2} w="fit-content">
            <option value="event-type" disabled>
              Event Type
            </option>
            <option value="watery-walk">Watery Walk</option>
            <option value="volunteer">Volunteer</option>
          </Select>
        </Flex>
        <Divider
          size="sm"
          borderWidth="1px"
          borderColor="black"
          alignSelf="center"
          w="100%"
          my={2}
        />
      </Box>
      <Box mt={10}>
        {unregisteredEvents.map((event) => (
          <Box
            key={event._id}
            position="relative"
            borderWidth="1px"
            p="4"
            mt="4"
            textAlign="left"
            h="64"
            mx="10"
            borderRadius="lg"
            style={{
              backgroundImage: `url("/image_720.png")`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              padding: "20px",
            }}
          >
            <Text
              fontSize="3xl"
              fontWeight="custom"
              color="white"
              className="bold-text"
            >
              {event.eventName}
            </Text>
            <Text
              fontSize="lg"
              fontWeight="custom"
              color="white"
              className="bold-text"
            >
              {event.location}
            </Text>
            <Text
              fontSize="lg"
              fontWeight="custom"
              color="white"
              className="bold-text"
            >
              {formatDate(event.startTime)}
            </Text>
            <Text
              fontSize="lg"
              fontWeight="custom"
              color="white"
              className="bold-text"
            >
              {formatDateTimeRange(event.startTime, event.endTime)}
            </Text>
            {/* positions the stuff to the left buttom when the parent box has relative position*/}
            <Box position="absolute"
              bottom="0"
              left="0"
              right="0"
              p={2}
              mx="2"
              my="2"> 
            <Button colorScheme="teal" mt={14} >
              Register for this event
            </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
