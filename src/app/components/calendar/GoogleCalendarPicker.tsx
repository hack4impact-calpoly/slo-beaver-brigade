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
} from '@chakra-ui/react';

interface GoogleCalendarPickerProps {
  onDateTimeSelect: (startTime: string, endTime: string) => void;
  onRecurringOptionsChange: (recurringOptions: {
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
  const calendarId = encodeURIComponent('primary');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const handleDaySelect = (day: string) => {
    setSelectedDays(prev => {
      const newDays = prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day];
      
      // Update parent component
      onRecurringOptionsChange({
        startDate,
        endDate,
        daysOfWeek: newDays,
        frequency,
      });
      
      return newDays;
    });
  };

  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    onRecurringOptionsChange({
      startDate: date,
      endDate,
      daysOfWeek: selectedDays,
      frequency,
    });
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    onRecurringOptionsChange({
      startDate,
      endDate: date,
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

      <FormControl>
        <FormLabel>Start Date</FormLabel>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => handleStartDateChange(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Repeat Until</FormLabel>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => handleEndDateChange(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Repeat</FormLabel>
        <Select 
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Repeat on</FormLabel>
        <HStack wrap="wrap" spacing={4}>
          {daysOfWeek.map((day) => (
            <Checkbox
              key={day.value}
              isChecked={selectedDays.includes(day.value)}
              onChange={() => handleDaySelect(day.value)}
            >
              {day.label}
            </Checkbox>
          ))}
        </HStack>
      </FormControl>
    </Stack>
  );
};

export default GoogleCalendarPicker;