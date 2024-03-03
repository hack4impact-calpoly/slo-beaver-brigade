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
  Button,
} from "@chakra-ui/react";
import Slider from "react-slick";
import axios from "axios";
import {useUser} from "@clerk/nextjs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { url } from "inspector";
import Image from "next/image";
import { IUser } from "@database/userSchema";

const Dashboard = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [users, setUsers] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

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
    const fetchUserData = async () => {
      try {
        if (isSignedIn) {
          // Access user data using the `user` object
          const userId = user.unsafeMetadata["dbId"];
          console.log("User ID:", userId);
          console.log("User:", user.emailAddresses[0].emailAddress, user);

          // Fetch user data
          const userResponse = await fetch(`/api/user/${userId}`);
          if (!userResponse.ok) {
            throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
          }

          const fetchedUser :IUser= await userResponse.json();
          setUsers([fetchedUser]); // Update the state with the fetched user

          // Extract event IDs from the user's eventsAttended field
          const eventIds = fetchedUser.eventsAttended || [];

          // Fetch details for each event ID
          const eventsPromises = eventIds.map(async (eventId) => {
            const eventResponse = await fetch(`/api/events/${eventId}`);
            if (!eventResponse.ok) {
              throw new Error(`Failed to fetch event ${eventId}: ${eventResponse.statusText}`);
            }
            return eventResponse.json();
          });

          // Wait for all event details requests to complete
          const fetchedEvents = await Promise.all(eventsPromises);
          setUserEvents(fetchedEvents); // Update the state with the fetched events
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    const fetchAllEvents = async () => {
      try {
        // Fetch all events (if needed)
        const eventsResponse = await fetch("/api/events");
        if (!eventsResponse.ok) {
          throw new Error(
            `Failed to fetch all events: ${eventsResponse.statusText}`
          );
        }
        const fetchedAllEvents = await eventsResponse.json();
        setAllEvents(fetchedAllEvents); // Update the state with all events
      } catch (error) {
        console.error("Error fetching all events:", error.message);
      }
    };

    // Call the fetchUserData and fetchAllEvents functions
    fetchUserData();
    fetchAllEvents();
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  return (
    <Box p="4">
      <Stack spacing={2} px="10" mb={6}>
        <Flex alignItems="center" justifyContent="space-between">
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color="grey"
          alignSelf="left"
          mb={3}
        >
          Your Upcoming Events
        </Text>
        <Button colorScheme="teal">
          Book Event
        </Button>
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
          {allEvents.map((event) => (
            <Box key={event._id} textAlign="center" px="4" mb="4">
              <Box
                className="event-box"
                borderWidth="1px"
                p="4"
                mb="4"
                h="60"
                textAlign="left"
                style={{
                  backgroundImage: `url("/underwater-saltwater-beavers.jpg")`,
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
                  mb={20}
                  mx={2}
                >
                  {event.eventName}
                </Text>
                <Text
                  fontSize="3xl"
                  fontWeight="custom"
                  color="white"
                  className="bold-text"
                  mx={2}
                >
                  {formatDate(event.startTime)}
                </Text>
                <Text
                  fontSize="xl"
                  fontWeight="custom"
                  color="white"
                  className="bold-text"
                  mx={2}
                >
                  {formatDateTimeRange(event.startTime, event.endTime)}
                </Text>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
      <Box px="10" mb={6}>
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize="2xl" fontWeight="bold" color="grey" mb={3}>
            Find More Volunteer Opportunities
          </Text>
          <Select
            defaultValue="event-type"
            onChange={(event) => console.log(event.target.value)}
            size="sm"
            ml={2}
            w="fit-content"
          >
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
      <Box
        borderWidth="1px"
        p="4"
        mt="4"
        textAlign="left"
        h={64}
        mx={10}
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
          Watery Walk With Cal Poly Hack4Impact
        </Text>
        <Text
          fontSize="lg"
          fontWeight="custom"
          color="white"
          className="bold-text"
        >
          Saturday, February 17
        </Text>
        <Text
          fontSize="lg"
          fontWeight="custom"
          color="white"
          className="bold-text"
        >
          9:00 AM - 11:00 AM
        </Text>
        {/* Your content inside the big rectangular box */}
        <Button colorScheme="teal" mt={14}>
          Register for this event
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
