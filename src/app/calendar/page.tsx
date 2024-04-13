"use client"
import React, { useState } from "react";
import Calendar from "@components/Calendar";
import Event, { IEvent } from "@database/eventSchema";
import style from "@styles/calendar/eventpage.module.css";
import DashboardCalendar from "@components/MiniCalendar";
import {
  Box,
  Heading,
  Flex,
  Checkbox,
  CheckboxGroup,
  Stack,
} from "@chakra-ui/react";
import connectDB from "@database/db";

export async function getEvents() {
  await connectDB(); // connect to db
  try {
    // query for all events and sort by date
    const events = await Event.find().sort({ date: -1 }).orFail();
    // returns all events in json format or errors
    return events;
  } catch (err) {
    return [];
  }
}

//converts an event into a FullCalendar event
export function Calendarify(event: IEvent) {
  //convert events into plain object before passing into client component
  const calEvent = JSON.parse(JSON.stringify(event));
  calEvent.title = event.eventName;
  delete calEvent.eventName;
  calEvent.start = event.startTime;
  calEvent.end = event.endTime;
  calEvent.id = event._id;

  if (event.eventName == "Beaver Walk") {
    calEvent.backgroundColor = "#8A6240";
    calEvent.borderColor = "#4D2D18";
    calEvent.textColor = "#fff";
  } else {
    calEvent.backgroundColor = "#0077b6";
    calEvent.borderColor = "#03045e";
    calEvent.textColor = "#fff";
  }

  return calEvent;
}

export function handleTimeChange() {

}

export function handleDateChange() {

}

export default async function Events() {
  const events = await getEvents();
  let calEvent = events.map(Calendarify);

  //Ievent object to pass into calendar component
  const dbEvent = JSON.parse(JSON.stringify(events));

  return (
    <Flex className={style.page} direction="column" align="flex-end">
      {" "}
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
          <CheckboxGroup colorScheme="green" defaultValue={[]}>
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
          <DashboardCalendar onTimeChange={handleTimeChange} onDateChange={handleDateChange}/>
        </Box>
        <Box flex="2" margin="10" padding="0">
          {" "}
          {/* Switch flex values for the calendar box */}
          <Calendar events={calEvent} admin={false} dbevents={dbEvent} />
        </Box>
      </Flex>
    </Flex>
  );
}
