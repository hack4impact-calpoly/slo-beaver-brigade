"use client";

import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Checkbox,
  Text,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Select,
  Switch,
} from "@chakra-ui/react";

interface DayOfWeek {
  label: string;
  value: string;
}

interface GoogleCalendarPickerProps {
  onDateTimeSelect: (startTime: string, endTime: string) => void;
  onRecurringOptionsChange: (recurringOptions: {
    isRecurring: boolean;
    startDate: string;
    endDate: string;
    daysOfWeek: string[];
    frequency: string;
  }) => void;
}

const GoogleCalendarPicker: React.FC<GoogleCalendarPickerProps> = ({
  onDateTimeSelect,
  onRecurringOptionsChange,
}) => {
  const calendarId = encodeURIComponent(
    process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || ""
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState("weekly");

  const daysOfWeek: DayOfWeek[] = [
    { label: "Sunday", value: "SU" },
    { label: "Monday", value: "MO" },
    { label: "Tuesday", value: "TU" },
    { label: "Wednesday", value: "WE" },
    { label: "Thursday", value: "TH" },
    { label: "Friday", value: "FR" },
    { label: "Saturday", value: "SA" },
  ];

  const handleDateTimeChange = () => {
    const fullStartDateTime = `${startDate}T${startTime}:00`;
    const fullEndDateTime = `${isRecurring ? endDate : startDate}T${endTime}:00`;
    onDateTimeSelect(fullStartDateTime, fullEndDateTime);
  };

  const updateRecurringOptions = () => {
    console.log("Current values:", {
      startDate,
      startTime,
      endDate,
      endTime,
    });

    if (startDate) {
      const fullStartDate = startTime ? `${startDate}T${startTime}` : startDate;

      const fullEndDate =
        endDate && endTime ? `${endDate}T${endTime}` : endDate || startDate;

      console.log("Updating with dates:", {
        fullStartDate,
        fullEndDate,
      });

      onRecurringOptionsChange({
        isRecurring,
        startDate: fullStartDate,
        endDate: fullEndDate,
        daysOfWeek: selectedDays,
        frequency: isRecurring ? frequency : "",
      });
    }
  };

  return (
    <Stack spacing={4} width="100%">
      {/* <Box
        width="400px"
        height="400px"
        borderRadius="md"
        overflow="hidden"
        border="1px solid"
        borderColor="gray.200"
        mb={4}
      >
        <iframe
          src={`https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=America%2FLos_Angeles&mode=WEEK&showNav=1&showTitle=0&showPrint=0&showTabs=1&showCalendars=0&height=400&wkst=1&bgcolor=%23ffffff&showDate=1`}
          style={{
            border: "none",
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
          frameBorder="0"
          scrolling="no"
        />
      </Box> */}

      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="recurring-toggle" mb="0">
          Recurring Event?
        </FormLabel>
        <Switch
          id="recurring-toggle"
          isChecked={isRecurring}
          onChange={(e) => {
            setIsRecurring(e.target.checked);
            if (!e.target.checked) {
              //cleae recurring data when switching to non recur
              setSelectedDays([]);
              setFrequency("weekly");
              //update parent component with cleared recur data
              updateRecurringOptions();
            }
            if (!e.target.checked) {
              setEndDate(startDate); //reset end date to start date when switching to non recur
            }
            updateRecurringOptions();
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Start Date</FormLabel>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => {
            console.log("Start date changed:", e.target.value);
            setStartDate(e.target.value);
            if (!isRecurring) {
              setEndDate(e.target.value);
            }
            updateRecurringOptions();
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Start Time</FormLabel>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => {
            console.log("Start time changed:", e.target.value);
            setStartTime(e.target.value);
            updateRecurringOptions();
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>End Time</FormLabel>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => {
            console.log("End time changed:", e.target.value);
            setEndTime(e.target.value);
            updateRecurringOptions();
          }}
        />
      </FormControl>

      {isRecurring && (
        <>
          <FormControl>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                handleDateTimeChange();
                updateRecurringOptions();
              }}
              style={{ display: isRecurring ? "block" : "none" }} // Hide if not recurring
            />
          </FormControl>
          <FormControl>
            <FormLabel>Repeat</FormLabel>
            <Select
              value={frequency}
              onChange={(e) => {
                const newFrequency = e.target.value;
                setFrequency(newFrequency);
                if (newFrequency !== "weekly") {
                  setSelectedDays([]);
                }

                onRecurringOptionsChange({
                  isRecurring,
                  startDate,
                  endDate,
                  daysOfWeek: newFrequency === "weekly" ? selectedDays : [], 
                  frequency: newFrequency,
                });
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormControl>

          {frequency === "weekly" && (
            <FormControl>
              <FormLabel>Repeat on</FormLabel>
              <HStack wrap="wrap" spacing={4}>
                {daysOfWeek.map((day: DayOfWeek) => (
                  <Checkbox
                    key={day.value}
                    isChecked={selectedDays.includes(day.value)}
                    onChange={() => {
                      const newDays = selectedDays.includes(day.value)
                        ? selectedDays.filter((d) => d !== day.value)
                        : [...selectedDays, day.value];
                      setSelectedDays(newDays);
                      updateRecurringOptions();
                    }}
                  >
                    {day.label}
                  </Checkbox>
                ))}
              </HStack>
            </FormControl>
          )}
        </>
      )}
    </Stack>
  );
};

export default GoogleCalendarPicker;
