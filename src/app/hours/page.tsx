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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import style from '@styles/admin/users.module.css';
import Link from 'next/link';
import { useUser } from '@clerk/clerk-react';
import { IEvent } from '@database/eventSchema';
import { IUser } from '@database/userSchema';

//convert date into format Dayofweek, Month
const formatDate = (date: Date) => {
  if (!(date instanceof Date)) {
    date = new Date(date); // Convert to Date object if not already
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

// convert date into xx:xx XM - xx:xx XM
const formatDuration = (start: Date, end: Date) => {
  if (!(start instanceof Date)) {
    start = new Date(start); // Convert to Date object if not already
  }

  if (!(end instanceof Date)) {
    end = new Date(end); // Convert to Date object if not already
  }

  // Calculate the time difference in milliseconds
  const timeDiff = end.getTime() - start.getTime();

  // Convert milliseconds to minutes
  const minutes = Math.floor(timeDiff / (1000 * 60));

  // Calculate remaining hours and minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes} min`;
};

// convert date into xx:xx XM - xx:xx XM
const getDuration = (start: Date, end: Date) => {
  if (!(start instanceof Date)) {
    start = new Date(start); // Convert to Date object if not already
  }

  if (!(end instanceof Date)) {
    end = new Date(end); // Convert to Date object if not already
  }

  // Calculate the time difference in milliseconds
  const timeDiff = end.getTime() - start.getTime();

  // Convert milliseconds to minutes
  const minutes = Math.floor(timeDiff / (1000 * 60));

  return minutes;
};

const AttendedEvents = () => {
  //states
  const { isSignedIn, user, isLoaded } = useUser();
  const [userEvents, setUserEvents] = useState<IEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);

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
          const currentDate = new Date();

          // Filter events where the current user is an attendee
          const userSignedUpEvents = allEvents.filter(
            (event: any) =>
              event.attendeeIds.includes(userId) &&
              new Date(event.startTime) >= currentDate
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
            (event: any) => new Date(event.startTime) >= currentDate
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
