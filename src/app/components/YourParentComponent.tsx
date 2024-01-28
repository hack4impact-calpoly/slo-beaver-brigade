// src/app/components/YourParentComponent.tsx
import React from 'react';
import EventExpandedView from './ExpandedViewComponent';

const YourParentComponent: React.FC = () => {
  const eventDetails = {
    name: 'Watery Walk',
    date: 'January 10',
    time: '8 AM - 9 AM',
    location: 'East Main Street',
    description: 'This is a sample event description.',
    weekDay: 'Wednesday',
    numVolunteers: 18,
    numVolunteersNeeded: 20,
  };

  return <EventExpandedView eventDetails={eventDetails} />;
};

export default YourParentComponent;
