// src/app/components/YourParentComponent.tsx
import React from 'react';
import EventExpandedView from './ExpandedViewComponent';

const YourParentComponent: React.FC = () => {
  const startTime = new Date();
  startTime.setHours(8, 0, 0); // Set hours, minutes, and seconds for 8 am

  const endTime = new Date();
  endTime.setHours(12, 0, 0); // Set hours, minutes, and seconds for 12 pm

  const eventDetails = {
    name: 'Watery Walk',
    date: new Date('2022-12-12'),
    startTime: startTime,
    endTime: endTime,
    location: 'East Main Street',
    description: 'This is a sample event description.',
    weekDay: 'Wednesday',
    numVolunteers: 18,
    numVolunteersNeeded: 20,
  };

  return <EventExpandedView eventDetails={eventDetails} />;
};

export default YourParentComponent;
