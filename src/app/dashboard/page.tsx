"use client";
import React, { useEffect , useState } from "react";
import { Box, Divider, Heading, Select, Stack, Text, useStatStyles, Flex } from "@chakra-ui/react";
import Slider from "react-slick";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Dashboard = () => {
  const events = [1, 2, 3];
  const [userEvents, setUserEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const { data: session } = useSession(); // Access user session data

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        if (session) {
          // Extract user ID from the session
          const userId = '65bed96eb82f4ef4ac394b40';

          // Fetch user data including events attended
          const response = await axios.get(`/api/user/${userId}`);
          const userData = response.data;

          // Extract events attended from user data
          const eventsAttended = userData.eventsAttended || [];
          console.log('Events Attended:', eventsAttended);

          setUserEvents(eventsAttended);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchAllEvents = async () => {
      try {
        // Fetch all events from your API
        const response = await axios.get('/api/events');
        const allEvents = response.data;
        console.log('All Events:', allEvents);

        setAllEvents(allEvents);
        console.log('All Events:', allEvents);
      } catch (error) {
        console.error('Error fetching all events:', error);
      }
    };

    fetchUserEvents();
    fetchAllEvents();
  }, [session]);

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
          <Text fontSize="2xl" fontWeight="bold"
            color="grey" alignSelf="flex-start" mb={3}>
            Your Upcoming Events
          </Text>
          <Divider size="sm" borderWidth="1px"
            borderColor="black" alignSelf="center" w="100%"/>
      </Stack>
      <Box px={6}>
      <Slider {...settings} >
        {events.map((event) => (
          <Box key={event._id} textAlign="center" px="4" mb="4">
            <Box
              className="event-box"
              borderWidth="1px"
              p="4"
              mb="4"
              h="60"
            >
              <Heading as="h6" fontSize="xl">
                {event}
              </Heading>
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
          <Select defaultValue="event-type" onChange={(event) => console.log(event.target.value)} size="sm" ml={2} w="fit-content">
            <option value="event-type" disabled>Event Type</option>
            <option value="watery-walk">Watery Walk</option>
            <option value="volunteer">Volunteer</option>
          </Select>
        </Flex>
        <Divider size="sm" borderWidth="1px" borderColor="black" alignSelf="center" w="100%" my={2} />
      </Box>
      <Box
        borderWidth="1px"
        p="4"
        mt="4"
        textAlign="center"
        h={64}
        mx={10}
      >
        {/* Your content inside the big rectangular box */}
      </Box>
    </Box>
  );
};

export default Dashboard;
