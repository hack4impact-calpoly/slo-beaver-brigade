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
import { MagnifyingGlassIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';
import style from '@styles/admin/users.module.css';
import Link from 'next/link';
import { useUser } from '@clerk/clerk-react';
import { IEvent } from '../../../database/eventSchema';
import { formatDate, formatDuration, getDuration } from '../../lib/dates';

const AttendedEvents = () => {
  //states
  const { isSignedIn, user, isLoaded } = useUser();
  const [userEvents, setUserEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  // table format
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });

  useEffect(() => {
    console.log('Fetching user events...');
    const fetchUserDataAndEvents = async () => {
      if (!isLoaded) return; //ensure that user data is loaded
      setEventsLoading(true);

      try {
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
        const pastEvents = allEvents.filter(
          (event: any) =>
          event.volunteerEvent && new Date(event.endTime) <= new Date(endDateTime) && new Date(event.startTime) >= new Date(startDateTime)
          );

        pastEvents.forEach((event: any) => {
          setTotalTime(
            totalTime + (getDuration(event.startTime, event.endTime) * event.attendeeIds.length)
          );
        });

        // Update state with events the user has signed up for
        setUserEvents(pastEvents);
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
        marginLeft="20px"
        marginRight="20px"
      >
        <Text fontWeight="500" fontSize="32px" textAlign="center">
          Congrats SLO Beaver Brigade You’ve done great this month! 🎉
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
          margin="20px"
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
            placeholder='Event Search'
            type='search'
            size="md"
            width='250px'
            margin='10px'
          />
        </Box>
      </Box>
      <div className={style.tableContainer}>
        <Box>
          <Table variant="striped" size={tableSize}>
            <Thead>
              <Tr>
                <Th>Event Name</Th>
                <Th>Num Attendees</Th>
                <Th>Duration</Th>
                <Th>Date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {userEvents.map((event) => (
                <Tr key={event._id}>
                  <Td>{event.eventName}</Td>
                  <Td>{event.attendeeIds.length}</Td>
                  <Td>{formatDuration(event.startTime, event.endTime)}</Td>
                  <Td>{formatDate(event.startTime)}</Td>
                  <Td>
                    <Link
                      href={`/event/${event._id}`}
                      className={style.viewDetails}
                    >
                      View Details
                    </Link>
                  </Td>
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
