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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import style from '@styles/admin/users.module.css';
import { useUser } from '@clerk/clerk-react';
import { IEvent } from '../../database/eventSchema';
import { formatDate, formatDuration } from '../lib/dates';
import { calcHours, filterUserSignedUpEvents } from '../lib/hours';
import { get } from 'http';
import { getUserDbData } from 'app/lib/authentication';
import { parse } from 'path';
import { IUser } from '@database/userSchema';

const AttendedEvents = () => {
  //states
  const { isSignedIn, user, isLoaded } = useUser();
  const [userEvents, setUserEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDateTime, setStartDateTime] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .substring(0, 16)
  );
  const [endDateTime, setEndDateTime] = useState(
    new Date().toISOString().substring(0, 16)
  );
  const [userFirstName, setUserFirstName] = useState('');

  // table format
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md' });

  async function fetchData(start: string, end: string): Promise<void> {
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

      // Fetch all events
      const eventsResponse = await fetch('/api/events/');
      if (!eventsResponse.ok) {
        throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
      }
      const allEvents = await eventsResponse.json();

      setStartDateTime(start);
      setEndDateTime(end);

      // Filter events where the current user is an attendee
      const userSignedUpEvents = filterUserSignedUpEvents(
        allEvents,
        userId,
        start,
        end,
        searchTerm
      );

      const hours = calcHours(userSignedUpEvents);
      setTotalTime(hours);

      // Update state with events the user has signed up for
      setUserEvents(userSignedUpEvents);
    }
  }

  useEffect(() => {
    const fetchUserDataAndEvents = async () => {
      if (!isLoaded) return; //ensure that user data is loaded
      try {
        await fetchData(startDateTime, endDateTime);
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
        margin="20px"
      >
        { totalTime === 0 ? (
          <Text
            fontWeight="500"
            fontSize="32px"
            textAlign="center"
            width="70%"
            margin="95px"
          >
            Looks like we could not find any events. 😢 Are you sure you
            attended an event that matches the current search?
          </Text>
        ) : (
          <Box>
            <Text fontWeight="500" fontSize="32px" textAlign="center">
              🎉 The beavers appreciate your amazing work, {userFirstName} 🎉
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
          </Box>
        )}
        <Wrap justify='center'>
          <WrapItem justifyItems="center" alignItems="center">
            <Text display="inline">
              From:
            </Text>
            <Input
              size="md"
              type="datetime-local"
              width="250px"
              margin="10px"
              value={startDateTime}
              onChange={async (e) => {
                fetchData(e.target.value, endDateTime);
              }}
            />
          </WrapItem>
          <WrapItem justifyItems="center" alignItems="center">
            <Text display="inline">
              To:
            </Text>
            <Input
              size="md"
              type="datetime-local"
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
