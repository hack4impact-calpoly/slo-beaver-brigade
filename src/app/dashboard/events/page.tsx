"use client";
import React, { useEffect, useState } from "react";
import style from "@styles/dashboard/events.module.css";

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
  groupsAllowed: string[];
  attendeeIds: string[];
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
      setEvents(data);
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
            <h3 className={style.eventTitle}>{event.eventName}</h3>
            <p className={style.eventLocation}>Location: {event.location}</p>
            <p className={style.eventDescription}>{event.description}</p>
            <p className={style.eventTime}>
              Start Time: {new Date(event.startTime).toLocaleString()}
              <br/> End Time: {new Date(event.endTime).toLocaleString()}
            </p>
            <p className={style.eventAccessibility}>
              Wheelchair Accessible: {event.wheelchairAccessible ? "Yes" : "No"}
              <br />
              Spanish Speaking Accommodation:{" "}
              {event.spanishSpeakingAccommodation ? "Yes" : "No"}
            </p>
            <p className={style.eventType}>
              Volunteer Event: {event.volunteerEvent ? "Yes" : "No"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
