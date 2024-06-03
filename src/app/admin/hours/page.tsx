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
import { formatDate, formatDuration, timeOfDay } from '../../lib/dates';
import { calcHoursForAll, eventHours, filterPastEvents } from '../../lib/hours';
import { getUserDbData } from 'app/lib/authentication';
import { IUser } from '@database/userSchema';
import { set } from 'mongoose';
import { getEvents } from 'app/actions/eventsactions';
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { CSVLink } from "react-csv";
import "../../fonts/fonts.css"


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

  const [csvData, setCsvData] = useState<any[]>([]);
  const [csvHeaders] = useState([
    { label: "Event Name", key: "eventName" },
    { label: "Date", key: "eventDate" },
    { label: "Start Time", key: "startTime"},
    { label: "Duration", key: "eventDuration" },
    { label: "Number of Volunteers", key: "numberVolunteers" },
    { label: "Volunteer Hours", key: "totalVolunteerHours" }
  ]);


  async function fetchData(start: string, end: string): Promise<void> {
    // Fetch all events
    const eventsResponse = await fetch('/api/events/');
    if (!eventsResponse.ok) {
      throw new Error(`Failed to fetch events: ${eventsResponse.statusText}`);
    }
    const allEvents: IEvent[] = await eventsResponse.json();


    const csvData = allEvents.map((event: IEvent) => ({
      eventName: event.eventName,
      eventDate: formatDate(event.startTime),
      startTime: timeOfDay(event.startTime),
      eventDuration:formatDuration(event.startTime, event.endTime),
      numberVolunteers: event.attendeeIds.length,
      totalVolunteerHours: eventHours(event)
    }));

    setCsvData(csvData);
    
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
      <Text fontFamily="Lato" fontSize="2xl" mt="5%" textAlign="center">
        Loading Events...
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
        { totalTime == 0 ? (
          <Text
            fontWeight="500"
            fontSize={["20px","26px","32px"]}
            textAlign="center"
            width="70%"
            margin={["40px","95px","95px"]}      
          >
            No volunteering events found.
            Create volunteering events to track hours!
          </Text>
        ) : (
          <Box>
            <Text 
              fontWeight="500" 
              fontSize={["20px","30px","32px"]} 
              textAlign="center"
              mb="20px"
              >
              🎉 Amazing work, Beaver Brigade 🎉
            </Text>
            <Box
              borderRadius="10px"
              m="4"
              mr={["30px","100px", "200px"]}
              ml={["30px","100px", "200px"]}
              paddingTop="30px"
              paddingBottom="30px"
              paddingLeft={["50px","90px","90px"]}
              paddingRight={["50px","90px","90px"]}
              gap="9px"
              bg="#337774"
              color="#FBF9F9"
              whiteSpace={"nowrap"}
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
                fontSize={["30px","40px","50px"]}
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
          <WrapItem justifyItems="center" alignItems="center" display="flex">
            <Box position="relative" display="flex" alignItems="center">
              <Input
                placeholder="Search Events"
                size="md"
                width="250px"
                margin="10px"
                border="1.5px solid #337774"
                _hover={{ borderColor: '#337774' }}
                focusBorderColor="#337774"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon
                style={{
                  width: "20px",
                  height: "20px",
                  position: "absolute",
                  right: "20px",
                }}
              />
            </Box>
          </WrapItem>
          <WrapItem>
            <Box mt={"20px"} mb={"20px"}>
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename="event-data.csv"
                className={style.yellowButton}
                target="_blank"
              >
                Export to CSV
                </CSVLink>
              </Box>
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
                <Th>Number of Volunteers</Th>
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
