import React, { useState, useEffect } from "react";
import Calendar from "@components/Calendar";
import Event, { IEvent } from "@database/eventSchema";
import style from "@styles/calendar/eventpage.module.css";
import {
  Box,
  Heading,
  Flex,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import connectDB from "@database/db";
import { Calendarify } from "app/lib/calendar";

interface FCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;}

export default function Page() {
  const [events, setEvents] = useState<FCEvent[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      await connectDB(); // Connect to the database
      try {
        // Query for events and sort by date
        const fetchedEvents = await Event.find().sort({ date: -1 }).orFail();

        // Transform IEvent objects to FCEvent objects
        const convertedEvents: FCEvent[] = fetchedEvents.map((event) => ({
          id: event._id,
          title: event.eventName,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
        }));

        setEvents(convertedEvents); // Set events
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }

    fetchData();
  }, []);

  const handleCheckboxChange = (selected: string[]) => {
    setSelectedFilters(selected);
  };

  return (
    <Flex className={style.page} direction="column" align="flex-end">
      <Flex width="full">
        <Box flex="1" margin="0" padding="0">
          <Box className={style.header}>
            <Heading
              as="h1"
              textTransform="none"
              textAlign="left"
              padding="10px"
              mb="5"
              ml="2"
            >
              Events Calendar
            </Heading>
          </Box>
          <Heading
            as="h1"
            textTransform="none"
            textAlign="left"
            padding="10px"
            fontSize="lg"
            color="gray.500"
            ml="5"
          >
            Filters
          </Heading>
          <CheckboxGroup
            colorScheme="green"
            defaultValue={selectedFilters}
            onChange={handleCheckboxChange}
          >
            <Stack spacing={[1, 5]} direction={["column", "column"]} ml="10">
              <Checkbox value="watery_walk" colorScheme="teal">
                Watery Walk
              </Checkbox>
              <Checkbox value="volunteer" colorScheme="yellow">
                Volunteer
              </Checkbox>
              <Checkbox value="special_events" colorScheme="green">
                Special Events
              </Checkbox>
              <Checkbox value="wheelchair_accessible" colorScheme="blue">
                Wheelchair Accessible
              </Checkbox>
              <Checkbox value="spanish_speaking" colorScheme="orange">
                Spanish Speaking
              </Checkbox>
            </Stack>
          </CheckboxGroup>
        </Box>
        <Box flex="2" margin="10" padding="0">
          <Calendar events={events} admin={false} />
        </Box>
      </Flex>
    </Flex>
  );
}
