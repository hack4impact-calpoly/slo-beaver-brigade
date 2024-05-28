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
import { EmailRSSComponent } from "app/components/EmailComponent";

export default function Page() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await fetch("/api/events/bytype/eventType");
        const data: string[] = await response.json();
        const uniqueEventTypes = Array.from(
          new Set([...data, "Volunteer", "Beaver Walk", "Pond Clean Up"])
        );
        setEventTypes(uniqueEventTypes);
      } catch (error) {
        console.error("Error fetching event types:", error);
      }
    };

    fetchEventTypes();
  }, []);

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
    <Box bg="white" minH="100vh" p="4">
      <Flex className={style.page} direction="column" align="flex-end">
        <Flex width="full" justify="space-between" alignItems="flex-start">
          <Box
            flex="1"
            maxWidth="350px"
            padding="0"
            mt="2%" 
            ml="5%"
            bg="#F5F5F5"
            borderRadius="md"
            p="5"
            pr="10"
            pb="10"
            boxShadow="sm"
          >
            <Heading
              as="h1"
              textTransform="none"
              textAlign="left"
              padding="10px"
              fontSize="24"
              ml="5"
              mb="3"
            >
              Event Filters
            </Heading>
            <CheckboxGroup
              colorScheme="green"
              value={selectedFilters}
              onChange={(values) =>
                setSelectedFilters(values.map((value) => String(value)))
              }
            >
              <Stack spacing={[1, 5]} direction={["column", "column"]} ml="10">
                {eventTypes.map((eventType) => (
                  <Checkbox key={eventType} value={eventType} colorScheme="teal">
                    {eventType}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
            <Heading
              as="h1"
              textTransform="none"
              textAlign="left"
              padding="10px"
              fontSize="24"
              ml="5"
              mt="10"
              mb="3"
            >
              Accessibility Filters
            </Heading>
            <CheckboxGroup
              colorScheme="yellow"
              value={selectedFilters}
              onChange={(values) =>
                setSelectedFilters(values.map((value) => String(value)))
              }
            >
              <Stack spacing={[1, 5]} direction={["column", "column"]} ml="10">
                <Checkbox
                  value="spanishSpeakingAccommodation"
                >
                  Spanish Speaking
                </Checkbox>
                <Checkbox
                  value="wheelchairAccessible"
                >
                  Wheelchair Accessible
                </Checkbox>
              </Stack>
            </CheckboxGroup>
            <div className="ml-[40px] mt-10">
              <EmailRSSComponent calendarURL="/api/events/calendar"/>
            </div>
          </Box>
          <Box
            flex="2"
            padding="0"
            mt="2%" 
            mr="10%"
            ml="5%"
            bg="#F5F5F5"
            borderRadius="md"
            p="5"
            boxShadow="sm"
          >
            <Calendar events={calEvent} admin={false} dbevents={events} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
