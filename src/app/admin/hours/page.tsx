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
  Wrap,
  WrapItem,
  TableContainer,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import style from '@styles/admin/users.module.css';
import Link from 'next/link';
import { useUser } from '@clerk/clerk-react';
import { IEvent } from '../../../database/eventSchema';
import { formatDate, formatDuration } from '../../lib/dates';
import { calcHoursForAll, eventHours, filterPastEvents } from '../../lib/hours';
import { getUserDbData } from 'app/lib/authentication';
import { IUser } from '@database/userSchema';
import { set } from 'mongoose';

const AttendedEvents = () => {
  //states
  const { isSignedIn, user, isLoaded } = useUser();
  const [userEvents, setUserEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateTime, setStartDateTime] = useState(
    new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(new Date().getHours() - 8))
      .toISOString()
      .substring(0, 10)
  );
  const [endDateTime, setEndDateTime] = useState(
    new Date(new Date().setHours(new Date().getHours() - 8)).toISOString().substring(0, 10)
  );
  const [userFirstName, setUserFirstName] = useState('');

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
    const pastEvents = filterPastEvents(allEvents, start, end, searchTerm);

    let hours = calcHoursForAll(pastEvents);
    setTotalTime(hours);

    // Update state with events the user has signed up for
    setUserEvents(pastEvents);

    if (isSignedIn) {
      let userId = '';
      let userFirstName = '';
      const userdata = await getUserDbData();
      if (userdata != null) {
        const user = JSON.parse(userdata) as IUser;
        userId = user._id;
        userFirstName = user.firstName;
      }
      setUserFirstName(userFirstName);
    }
  }

  useEffect(() => {
    const fetchUserDataAndEvents = async () => {
      if (!isLoaded) return; //ensure that user data is loaded
      try {
        fetchData(startDateTime, endDateTime);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setTimeout(() => {
          setEventsLoading(false); // Stop loading irrespective of outcome
        }, 200);
      }
    };

    // Call the function to fetch user data and events
    fetchUserDataAndEvents();
  }, [isSignedIn, user, isLoaded, searchTerm]);

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
        { totalTime == 0 ? (
          <Text
            fontWeight="500"
            fontSize="32px"
            textAlign="center"
            width="70%"
            margin="80px"
          >
            Looks like we could not find any events. 😢 Are you sure there is an
            event that matches the current search?
          </Text>
        ) : (
          <Box>
            <Text fontWeight="500" fontSize="32px" textAlign="center">
              🎉 Way to go Beaver Brigade!!! 🎉
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
                Total Volunteer Hours
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
          </Box>
        )}
        <Wrap justify="center" width="90%">
          <WrapItem justifyItems="center" alignItems="center">
            <Text display="inline">From:</Text>
            <Input
              size="md"
              type="date"
              width="250px"
              margin="10px"
              value={startDateTime}
              onChange={async (e) => {
                fetchData(e.target.value, endDateTime);
              }}
            />
          </WrapItem>
          <WrapItem justifyItems="center" alignItems="center">
            <Text display="inline">To:</Text>
            <Input
              size="md"
              type="date"
              width="250px"
              margin="10px"
              value={endDateTime}
              onChange={async (e) => {
                fetchData(startDateTime, e.target.value);
              }}
            />
          </WrapItem>
          <WrapItem justifyItems="center" alignItems="center">
            <Input
              placeholder="Event Search"
              size="md"
              width="250px"
              margin="10px"
              display="flex"
              flexDirection="row"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </WrapItem>
        </Wrap>
      </Box>
      <TableContainer>
        <Box>
          <Table variant="striped" size={tableSize}>
            <Thead>
              <Tr>
                <Th>Event Name</Th>
                <Th>Duration</Th>
                <Th>Num Attendees</Th>
                <Th>Total Hours From Event</Th>
                <Th>Date</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {userEvents.map((event) => (
                <Tr key={event._id}>
                  <Td>{event.eventName}</Td>
                  <Td>{formatDuration(event.startTime, event.endTime)}</Td>
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
      </TableContainer>
    </div>
  );
};

export default AttendedEvents;
