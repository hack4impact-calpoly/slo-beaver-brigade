"use client"
import React, { useEffect, useState } from "react";
import Calendar from "app/components/calendar/Calendar";
import Event, { IEvent } from "@database/eventSchema";
import style from "@styles/calendar/eventpage.module.css";
import {
  Box,
  Heading,
  Flex,
  Checkbox,
  CheckboxGroup,
  Stack,
  useMediaQuery
} from "@chakra-ui/react";
import connectDB from "@database/db";
import { Calendarify } from "app/lib/calendar";
import { getSelectedEvents } from "app/actions/eventsactions";
import { EmailRSSComponent } from "app/components/EmailComponent";
import { useEventsAscending } from "app/lib/swrfunctions";
import "../fonts/fonts.css"

export default function Page() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const {events, isLoading} = useEventsAscending()
  const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([])
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
    if (isLoading) return;
    if (!events) return;

    const eventTypes = selectedFilters.filter(
      (filter) => filter !== "spanishSpeakingAccommodation" && filter !== "wheelchairAccessible"
    );
    const accessibilityFilters = selectedFilters.filter(
      (filter) => filter === "spanishSpeakingAccommodation" || filter === "wheelchairAccessible"
    );

    const filtered = events.filter((event) => {
      const matchesType = eventTypes.length === 0 || eventTypes.includes(event.eventType || "");
      const matchesAccessibility = accessibilityFilters.every((filter) => {
        if (filter === "spanishSpeakingAccommodation") return event.spanishSpeakingAccommodation;
        if (filter === "wheelchairAccessible") return event.wheelchairAccessible;
        return true;
      });
      return matchesType && matchesAccessibility;
    });

    setFilteredEvents(filtered);
  }, [events, selectedFilters]);

  const calEvent = filteredEvents.map(Calendarify);

  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");


  return (
    <Box bg="white" minH="100vh" p="4">
      <Flex className={style.page} direction="column" align="flex-end">
        <Flex width="full" justify="space-between" alignItems="flex-start">
          {isLargerThan800 ? (
          <Box
            flex="1"
            maxWidth="300px"
            m="2%"
            p={[5, 5, 5, 5]}
            bg="#F5F5F5"
            borderRadius="md"
            boxShadow="sm"
            height="775px"
            className="filterContainer"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box>
              <Heading
                as="h1"
                textTransform="none"
                textAlign="left"
                padding="10px"
                fontSize="20"
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
                <Stack spacing={[1, 5]} direction={["column", "column"]} ml="5">
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
                fontSize="20"
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
                <Stack spacing={[1, 5]} direction={["column", "column"]} ml="5">
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
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb="5"
            >
              <EmailRSSComponent calendarURL="/api/events/calendar"/>
            </Box>
          </Box>
          ) : null}
          <Box
            flex="2"
            padding="0"
            mt="2%" 
            mr="1%"
            ml="1%"
            bg="#F5F5F5"
            borderRadius="md"
            p="5"
            boxShadow="sm"
            h="775px"
          >
            <Calendar events={calEvent || []} admin={false} dbevents={filteredEvents} />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
