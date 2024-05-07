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
import { IEvent } from '../../../database/eventSchema';
import { formatDate, formatDuration } from '../../lib/dates';
import { calcHours, calcHoursForAll, eventHours, filterPastEvents } from '../../lib/hours';

const AttendedEvents = () => {
  //states
  const { isSignedIn, user, isLoaded } = useUser();
  const [userEvents, setUserEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateTime, setStartDateTime] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1)).toString()
  );
  const [endDateTime, setEndDateTime] = useState(new Date().toString());

  // table format
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });

  async function fetchData(start: string, end: string): Promise<void> {
    // Fetch all events
    const eventsResponse = await fetch('/api/events/');
    if (!eventsResponse.ok) {
      throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
    }
    const allEvents = await eventsResponse.json();

    setStartDateTime(start);
    setEndDateTime(end);

    // Filter events where the current user is an attendee
    const pastEvents = filterPastEvents(allEvents, start, end);

    console.log(start, end);
    console.log(allEvents, pastEvents);

    let hours = calcHoursForAll(pastEvents);
    setTotalTime(hours);

    // Update state with events the user has signed up for
    setUserEvents(pastEvents);
  }

  useEffect(() => {
    const fetchUserDataAndEvents = async () => {
      if (!isLoaded) return; //ensure that user data is loaded
      setEventsLoading(true);
      try {
        fetchData(startDateTime, endDateTime);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setEventsLoading(false); // Stop loading irrespective of outcome
      }
    };

    // Call the function to fetch user data and events
    fetchUserDataAndEvents();
  }, [isSignedIn, user, isLoaded]);

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
      { Math.floor(totalTime / 60) === 0 && Math.floor(totalTime % 60) == 0 ? (
        <Text fontWeight="500" fontSize="32px" textAlign="center">
        Host volunteering events to track hours!
        </Text>
      ):(
      <Text fontWeight="500" fontSize="32px" textAlign="center">
      🎉 Amazing work, Beaver Brigade team  🎉
      </Text>
      )
      }
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
            Volunteer Hours
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
            onChange={(e) => fetchData(e.target.value, endDateTime)}
          />
          <Text display="inline">To:</Text>
          <Input
            placeholder="To:"
            size="md"
            type="datetime-local"
            width="250px"
            margin="10px"
            onChange={(e) => fetchData(startDateTime, e.target.value)}
          />
          <Input
            placeholder="Event Search"
            type="search"
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
                  <Td>{eventHours(event)}</Td>
                  <Td>{formatDate(event.startTime)}</Td>
                  <Td>
                    <Link
                      href={`events/edit/${event._id}`}
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
