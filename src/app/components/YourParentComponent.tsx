// src/app/components/YourParentComponent.tsx
import React from 'react';
import EventExpandedView from './ExpandedViewComponent';
import { IEvent } from '@database/eventSchema';

const YourParentComponent: React.FC = () => {
  const startTime = new Date();
  startTime.setHours(8, 0, 0); // Set hours, minutes, and seconds for 8 am

  const endTime = new Date();
  endTime.setHours(12, 0, 0); // Set hours, minutes, and seconds for 12 pm

  const eventDetails: IEvent = {
    eventName: 'Watery Walk',
    location: 'East Main Street',
    description: 'This is a sample event description.',
    wheelchairAccessible: true,
    spanishSpeakingAccommodation: false,
    startTime: startTime,
    endTime: endTime,
    volunteerEvent: true,
    groupsAllowed: [1, 2, 3],
    attendeeIds: [], // array of Schema.Types.ObjectId
  };

  return <EventExpandedView eventDetails={eventDetails} />;
};

export default YourParentComponent;