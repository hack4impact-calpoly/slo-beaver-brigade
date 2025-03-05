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
    <Stack spacing={4} width="100%" minWidth="40vw">
      <Box width="100%">
        <FormControl display="flex" alignItems="center" width="100%" mb={4}>
          <FormLabel htmlFor="recurring-toggle" mb="0">
            Recurring Event?
          </FormLabel>
          <Switch
            id="recurring-toggle"
            isChecked={isRecurring}
            onChange={(e) => {
              setIsRecurring(e.target.checked);
              if (!e.target.checked) {
                setSelectedDays([]);
                setFrequency("weekly");
                updateRecurringOptions();
              }
              if (!e.target.checked) {
                setEndDate(startDate);
              }
              updateRecurringOptions();
            }}
          />
        </FormControl>

        <Stack spacing={4} width="100%">
          {/* Date Selection */}
          <HStack spacing={4} width="100%" align="flex-start">
            <FormControl width="50%">
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

            <FormControl width="50%">
              <FormLabel>End Date</FormLabel>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  handleDateTimeChange();
                  updateRecurringOptions();
                }}
                isDisabled={!isRecurring}
                opacity={isRecurring ? 1 : 0.5}
                _disabled={{
                  cursor: "not-allowed",
                  opacity: 0.5,
                }}
              />
            </FormControl>
          </HStack>

          {/* Time Selection */}
          <HStack spacing={4} width="100%" align="flex-start">
            <FormControl width="50%">
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

            <FormControl width="50%">
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
          </HStack>

          {isRecurring && (
            <>
              <FormControl width="100%">
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
                <FormControl width="100%">
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
      </Box>
    </Stack>
  );
};

export default GoogleCalendarPicker;
