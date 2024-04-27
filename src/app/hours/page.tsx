'use client';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  useBreakpointValue,
  Text,
  Input,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import style from '@styles/admin/users.module.css';
import Link from 'next/link';
import { useUser } from '@clerk/clerk-react';
import { IEvent } from '../../database/eventSchema';
import { formatDate, formatDuration, getDuration } from '../lib/dates';

const AttendedEvents = () => {
  //states
  const { isSignedIn, user, isLoaded } = useUser();
  const [userEvents, setUserEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');

  // table format
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });

  useEffect(() => {
    console.log('Fetching user events...');
    const fetchUserDataAndEvents = async () => {
      if (!isLoaded) return; //ensure that user data is loaded
      setEventsLoading(true);

      try {
        if (isSignedIn) {
          const userId = user.unsafeMetadata['dbId']; // Assuming this is the correct ID to match against event attendees

          // Fetch all events
          const eventsResponse = await fetch('/api/events');
          if (!eventsResponse.ok) {
            throw new Error(
              `Failed to fetch events: ${eventsResponse.statusText}`
            );
          }
          const allEvents = await eventsResponse.json();

          if (startDateTime === "") {
            const today = new Date();
            setStartDateTime(new Date(today.setMonth(today.getMonth() - 1)).toString());
          }
          if (endDateTime === "") {
            const today = new Date();
            setEndDateTime(today.toString());
          }

          // Filter events where the current user is an attendee
          const userSignedUpEvents = allEvents.filter(
            (event: any) =>
              event.attendeeIds.includes(userId) &&
              event.volunteerEvent &&
              new Date(event.startTime) >= new Date(startDateTime) &&
              new Date(event.endTime) <= new Date(endDateTime)
          );

          userSignedUpEvents.forEach((event: any) => {
            setTotalTime(
              totalTime + getDuration(event.startTime, event.endTime)
            );
          });

          // Update state with events the user has signed up for
          setUserEvents(userSignedUpEvents);
        } else {
          // Reset the events when user signs out
          const eventsResponse = await fetch('/api/events');
          if (!eventsResponse.ok) {
            throw new Error(
              `Failed to fetch events: ${eventsResponse.statusText}`
            );
          }
          const allEvents = await eventsResponse.json();
          const currentDate = new Date();

          // Getting all upcoming events
          const userEvents = allEvents.filter(
            (event: any) =>
              event.volunteerEvent && new Date(event.startTime) >= currentDate
          );

          console.log(userEvents);

          setUserEvents([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        console.log('Events loaded');
        setEventsLoading(false); // Stop loading irrespective of outcome
      }
    };

    // Call the function to fetch user data and events
    fetchUserDataAndEvents();
  }, [isSignedIn, user, isLoaded, startDateTime, endDateTime]);

  //return a loading message while waiting to fetch events
  if (!isLoaded || eventsLoading) {
    return (
      <Text fontSize="lg" textAlign="center">
        Loading events...
      </Text>
    );
  }

  return (
    <div className={style.mainContainer}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        margin="20px"
      >
        <Text fontWeight="500" fontSize="32px" textAlign="center" margin="20px">
          Congrats, You’ve done great this month! 🎉
        </Text>
        <Box
          borderRadius="10.21px"
          m="4"
          p="20.42px"
          paddingTop="54.46px"
          paddingBottom="54.46px"
          gap="9.36px"
          bg="#337774"
          color="#FBF9F9"
        >
          <Text
            fontFamily="500"
            fontSize="18.61px"
            display="flex"
            justifyContent="center"
            textAlign="center"
          >
            Total Volunteer Hours Accumulated
          </Text>
          <Text
            fontWeight="600"
            fontSize="50.07px"
            display="flex"
            justifyContent="center"
            textAlign="center"
          >
            {Math.floor(totalTime / 60)} h {totalTime % 60} min
          </Text>
        </Box>
        <Box>
          <Text display="inline">From:</Text>
          <Input
            placeholder="From:"
            size="md"
            type="datetime-local"
            width="250px"
            margin="10px"
            onChange={(e) => setStartDateTime(e.target.value)}
          />
          <Text display="inline">To:</Text>
          <Input
            placeholder="To:"
            size="md"
            type="datetime-local"
            width="250px"
            margin="10px"
            onChange={(e) => setEndDateTime(e.target.value)}
          />
          <Input
            placeholder="Event Search"
            size="md"
            width="250px"
            margin="10px"
          />
        </Box>
      </Box>
      <div className={style.tableContainer}>
        <Box>
          <Table variant="striped" size={tableSize}>
            <Thead>
              <Tr>
                <Th>Event Name</Th>
                <Th>Duration</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {userEvents.map((event) => (
                <Tr key={event._id}>
                  <Td>{event.eventName}</Td>
                  <Td>{formatDuration(event.startTime, event.endTime)}</Td>
                  <Td>{formatDate(event.startTime)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </div>
    </div>
  );
};

export default AttendedEvents;
