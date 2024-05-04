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

export default function Page() {
  const [calEvent, setCalEvent] = useState<IEvent[]>([]);
  const [dbEvent, setDbEvent] = useState<IEvent[]>([]);

  useEffect(() => {
    async function fetchData() {
      await connectDB(); // Connect to the database
      try {
        // Query for events and sort by date
        const events = await Event.find().sort({ date: -1 }).orFail();
        setDbEvent(events); // Set all events from the database

        // Filter events based on selected filters
        const filteredEvents = events.filter((event) =>
          selectedFilters.includes(event.eventType)
        );

        setCalEvent(filteredEvents); // Set filtered events for the calendar
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }

    fetchData();
  }, []);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

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
          <Calendar events={calEvent} admin={false} dbevents={dbEvent} />
        </Box>
      </Flex>
    </Flex>
  );
}
