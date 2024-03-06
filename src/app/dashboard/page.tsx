"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Heading,
  Select,
  Stack,
  Text,
  Flex,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import Slider from "react-slick";
import { useUser } from "@clerk/nextjs";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { css } from "@emotion/react";
import '@emotion/react';

// logic for letting ts know about css prop
declare module 'react' {
  interface Attributes {
    css?: any;
  }
}

// placeholder to ensure format consistency when there is only 1-2 events
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
  type Event = {
    _id: string;
    attendeeIds: string[];
    eventName: string;
    startTime: Date; // Assuming ISO string format
    endTime: Date; // Assuming ISO string format
    location: string;
    imageUrl?: string;
  };

  const sliderStyles = css`
    .slick-dots li button:before {
    }

    .slick-prev:before,
    .slick-next:before {
      color: teal; // Your desired color for arrows
    }
  `;

  const { isSignedIn, user, isLoaded } = useUser();
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [unregisteredEvents, setUnregisteredEvents] = useState<Event[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // breakpoint for different viewport size
  const eventNameSize = useBreakpointValue({ base: "lg", md: "xl", lg: "3xl" });
  const eventDetailSize = useBreakpointValue({
    base: "md",
    md: "lg",
    lg: "xl",
  });
  const eventTimeSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });

  //convert date into format Dayofweek, Month
  const formatDate = (date: Date) => {
    if (!(date instanceof Date)) {
      date = new Date(date); // Convert to Date object if not already
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // convert date into xx:xx XM - xx:xx XM
  const formatDateTimeRange = (start: Date, end: Date) => {
    if (!(start instanceof Date)) {
      start = new Date(start); // Convert to Date object if not already
    }

    if (!(end instanceof Date)) {
      end = new Date(end); // Convert to Date object if not already
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric", // "numeric" or "2-digit"
      minute: "numeric", // "numeric" or "2-digit"
    };

    const formattedStart = start.toLocaleTimeString("en-US", options);
    const formattedEnd = end.toLocaleTimeString("en-US", options);

    return `${formattedStart} - ${formattedEnd}`;
  };

  useEffect(() => {
    const fetchUserDataAndEvents = async () => {
      setEventsLoading(true);
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
          const userSignedUpEvents = allEvents.filter(
            (event: any) =>
              event.attendeeIds.includes(userId) &&
              new Date(event.startTime) >= currentDate
          );
          // Filter events where the current user is not an attendee
          const eventsUserHasntRegistered = allEvents
            .filter(
              (event: any) =>
                !event.attendeeIds.includes(userId) &&
                new Date(event.startTime) >= currentDate
            )
            .slice(0, 2); // Get first two events user hasn't registered for

          // Update state with events the user has signed up for
          setUserEvents(userSignedUpEvents);
          setUnregisteredEvents(eventsUserHasntRegistered);
          console.log(eventsUserHasntRegistered);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setEventsLoading(false); // Stop loading irrespective of outcome
      }
    };

    // Call the function to fetch user data and events
    fetchUserDataAndEvents();
  }, [isSignedIn, user]);

  // settings for slider
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3, // Show 3 slides for widths of 1280px or less
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // Show 2 slides for widths of 1024px or less
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Only show 1 slide for widths of 600px or less
          slidesToScroll: 1,
          infinite: userEvents.length > 1, // Enable infinite looping only if there's more than 1 event
        },
      },
    ],
  };

  const adjustedSettings = {
    ...settings,
    slidesToShow: Math.min(userEvents.length, 3), // Show up to 3 slides, or less if there aren't enough events
    infinite: userEvents.length > 3, // Only enable infinite looping if there are more than 3 events
  };

  const allDataLoaded = !eventsLoading && isLoaded;

  return (
    <div css={sliderStyles}>
      <Box p="4">
        <Stack spacing={2} px="10" mb={6}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="bold" color="black" mb={3}>
              Your Upcoming Events
            </Text>
            <Heading as="h2" fontSize="xl">
              <Button colorScheme="yellow" fontSize={eventDetailSize}>
                Book a Event
              </Button>
            </Heading>
          </Flex>
          <Divider
            size="sm"
            borderWidth="1px"
            borderColor="black"
            alignSelf="center"
            w="100%"
          />
          {!allDataLoaded ? (
            <Text fontSize="2xl"
            fontWeight="bold"
            color="black"
            textAlign="center"
            mt={5}>Loading...</Text>
          ) : !isSignedIn ? (
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="black"
              textAlign="center"
              mt={5}
            >
              Sign in to see all your upcoming events！ ʕ•ᴥ•ʔ
            </Text>
          ) : userEvents.length === 0 ? (
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="black"
              textAlign="center"
              mt={5}
            >
              Register more events below！ ʕง•ᴥ•ʔง
            </Text>
          ) : null}
        </Stack>
        <Box px={6}>
        {userEvents.length > 0 ? (
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
                    <Heading as="h1" size="2xl">
                      <Text
                        fontSize={eventNameSize}
                        fontWeight="black"
                        color="white"
                        className="bold-text"
                        mx={2}
                      >
                        {event.eventName}
                      </Text>
                    </Heading>
                    <Box
                      position="absolute"
                      bottom="0"
                      left="0"
                      right="0"
                      p={2}
                      mx="2"
                      my="2"
                    >
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
        ) : (null)}
        </Box>
        {/* Re-include the omitted bottom section here */}
        <Box px="10" mb={6}>
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize="2xl" fontWeight="bold" color="black" mb={3}>
              Find More Volunteer Opportunities
            </Text>
            <Select defaultValue="event-type" size="md" ml={2} w="fit-content" color="black">
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
          {!allDataLoaded ? (
            <Text fontSize="2xl"
            fontWeight="bold"
            color="black"
            textAlign="center"
            mt={5}>Loading...</Text>
          ) : !isSignedIn ? (
            <Text fontSize="2xl"
            fontWeight="bold"
            color="black"
            textAlign="center"
            mt={5}>Sign in to see more volunteer opportunities！ ʕ•ᴥ•ʔ</Text>
          ) : (isSignedIn && unregisteredEvents.length === 0) ? (
            <Text fontSize="2xl"
            fontWeight="bold"
            color="black"
            textAlign="center"
            mt={5}>No volunteer opportunities at the moment！ʕ•ᴥ•ʔ</Text>
          ) : null}
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
              <Heading as="h1" size="3xl" mb="1">
                <Text
                  fontSize="3xl"
                  fontWeight="custom"
                  color="white"
                  className="bold-text"
                >
                  {event.eventName}
                </Text>
              </Heading>
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
              <Box
                position="absolute"
                bottom="0"
                left="0"
                right="0"
                p={2}
                mx="2"
                my="2"
              >
                <Heading as="h2" fontSize="xl">
                  <Button
                    colorScheme="yellow"
                    fontSize={eventDetailSize}
                    mt={14}
                  >
                    Register for this event
                  </Button>
                </Heading>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
