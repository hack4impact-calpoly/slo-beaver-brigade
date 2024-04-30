// src/app/components/YourParentComponent.tsx
import React, {useState} from "react";
import EventExpandedView from "./StandaloneExpandedViewComponent";
import { IEvent } from "@database/eventSchema";

const YourParentComponent: React.FC = () => {
  const [showExpandedView, setShowExpandedView] = useState(false);
  const startTime = new Date();
  startTime.setHours(8, 0, 0); // Set hours, minutes, and seconds for 8 am

  const endTime = new Date();
  endTime.setHours(12, 0, 0); // Set hours, minutes, and seconds for 12 pm

  const eventDetails: IEvent = {
    _id:"sampleid",
    eventType: "",
    eventImage: null,
    checklist: "N/A",
    eventName: "Watery Walk",
    location: "East Main Street",
    description: "This is a sample event description.",
    wheelchairAccessible: true,
    spanishSpeakingAccommodation: false,
    startTime: startTime,
    endTime: endTime,
    volunteerEvent: true,
    groupsAllowed: [],
    registeredIds: [], // array of Schema.Types.ObjectId
    attendeeIds: []
  };

  return <EventExpandedView eventDetails={eventDetails} showModal={showExpandedView} setShowModal={setShowExpandedView}/>;
};

export default YourParentComponent;
