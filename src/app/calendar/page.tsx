"use client"
import React, { useEffect, useState } from "react";
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
import { getSelectedEvents } from "app/actions/eventsactions";

export default function Page() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const selectedEventsString = await getSelectedEvents(selectedFilters);
        const parsedEvents: IEvent[] = JSON.parse(selectedEventsString);
        setEvents(parsedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [selectedFilters]);

  const calEvent = events.map(Calendarify);

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
            value={selectedFilters}
            onChange={(values) =>
              setSelectedFilters(values.map((value) => String(value)))
            }
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
              <Checkbox value="spanish_speaking" colorScheme="blue">
                Spanish Speaking
              </Checkbox>
              <Checkbox value="wheelchair_accessible" colorScheme="orange">
                Wheelchair Accessible
              </Checkbox>
            </Stack>
          </CheckboxGroup>
        </Box>
        <Box flex="2" margin="10" padding="0">
          <Calendar events={calEvent} admin={false} dbevents={events} />
        </Box>
      </Flex>
    </Flex>
  );
}
