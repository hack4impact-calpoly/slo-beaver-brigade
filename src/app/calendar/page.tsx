"use client"
import React, { useState } from "react";
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

export default async function Page() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const events = await getEvents(selectedFilters);
  let calEvent = events.map(Calendarify);
  //Ievent object to pass into calendar component
  const dbEvent = JSON.parse(JSON.stringify(events));
  return (
    <Flex className={style.page} direction="column" align="flex-end">
      {/* Set direction to column and align to flex-end */}
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
          <CheckboxGroup colorScheme="green" defaultValue={selectedFilters}>
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
async function getEvents(selectedFilters: string[]) {
  await connectDB(); // connect to db
  try {
    let query = Event.find().sort({ date: -1 });

    // Apply filters if any selected
    if (selectedFilters.length > 0) {
      query = query.where("eventType").in(selectedFilters);
    }

    // Execute the query
    const events = await query.exec();

    // returns all events in json format or errors
    return events;
  } catch (err) {
    return [];
  }
}
