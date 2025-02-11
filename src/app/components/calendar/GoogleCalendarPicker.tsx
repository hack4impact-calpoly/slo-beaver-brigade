'use client';

import React, { useState } from 'react';
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
} from '@chakra-ui/react';

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
  onRecurringOptionsChange 
}) => {
  const calendarId = encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || '');
  const [isRecurring, setIsRecurring] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('weekly');

  const daysOfWeek = [
    { label: 'Sunday', value: 'SU' },
    { label: 'Monday', value: 'MO' },
    { label: 'Tuesday', value: 'TU' },
    { label: 'Wednesday', value: 'WE' },
    { label: 'Thursday', value: 'TH' },
    { label: 'Friday', value: 'FR' },
    { label: 'Saturday', value: 'SA' },
  ];

  const handleDateTimeChange = () => {
    const fullStartDateTime = `${startDate}T${startTime}:00`;
    const fullEndDateTime = `${isRecurring ? endDate : startDate}T${endTime}:00`;
    onDateTimeSelect(fullStartDateTime, fullEndDateTime);
  };

  const updateRecurringOptions = () => {
    onRecurringOptionsChange({
      isRecurring,
      startDate,
      endDate: isRecurring ? endDate : startDate,
      daysOfWeek: selectedDays,
      frequency,
    });
  };

  return (
    <Stack spacing={4} width="100%">
      <Box 
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
            border: 'none',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }}
          frameBorder="0"
          scrolling="no"
        />
      </Box>

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
              setEndDate(startDate); // Reset end date to start date when switching to non-recurring
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
            setStartDate(e.target.value);
            if (!isRecurring) {
              setEndDate(e.target.value); // Update end date if not recurring
            }
            handleDateTimeChange();
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
            setStartTime(e.target.value);
            handleDateTimeChange();
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel>End Time</FormLabel>
        <Input
          type="time"
          value={endTime}
          onChange={(e) => {
            setEndTime(e.target.value);
            handleDateTimeChange();
          }}
        />
      </FormControl>

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
            />
          </FormControl>

      {isRecurring && (
        <>
          <FormControl>
            <FormLabel>Repeat</FormLabel>
            <Select 
              value={frequency}
              onChange={(e) => {
                setFrequency(e.target.value);
                updateRecurringOptions();
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormControl>

          {frequency === 'weekly' && (
            <FormControl>
              <FormLabel>Repeat on</FormLabel>
              <HStack wrap="wrap" spacing={4}>
                {daysOfWeek.map((day) => (
                  <Checkbox
                    key={day.value}
                    isChecked={selectedDays.includes(day.value)}
                    onChange={() => {
                      const newDays = selectedDays.includes(day.value)
                        ? selectedDays.filter(d => d !== day.value)
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