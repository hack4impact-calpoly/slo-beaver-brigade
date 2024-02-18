"use client";
import React, { useEffect, useState } from "react";
import style from "@styles/dashboard/events.module.css";
import ExpandedViewComponent from "@components/ExpandedViewComponent";

interface IEvent {
  _id: string;
  eventName: string;
  location: string;
  description: string;
  wheelchairAccessible: boolean;
  spanishSpeakingAccommodation: boolean;
  startTime: Date;
  endTime: Date;
  volunteerEvent: boolean;
  groupsAllowed: [];
  attendeeIds: [];
}

const EventList = () => {
  const [events, setEvents] = useState<IEvent[]>([]);

  // get events from api endpoint
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      const eventsWithDateObjects = data.map((event: IEvent) => ({
        ...event,
        startTime: new Date(event.startTime),
        endTime: new Date(event.endTime),
      }));
      setEvents(eventsWithDateObjects);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect to fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // filter all events to upcoming events
  const upcomingEvents = events.filter(
    (event) => new Date(event.startTime) > new Date()
  );

  return (
    //map over events to list upcoming events
    <div className={style.mainContainer}>
      <h2>Upcoming Events</h2>
      <ul className={style.eventsList}>
        {upcomingEvents.map((event) => (
          <li key={event._id} className={style.eventItem}>
            <div className={style.expandedViewWrapper}>
              <div className={style.component}>
                <ExpandedViewComponent eventDetails={event} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
