"use client";
import React, { useEffect, useState } from "react";
import style from "@styles/admin/events.module.css";
import EventPreviewComponent from "@components/EventPreview";

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
  visitorCount?: number;
  groupsAllowed: [];
  attendeeIds: [];
  digitalWaiver: string | null;
  groupId: string | null;
}

const EventPreview = () => {
  // states
  const [events, setEvents] = useState<IEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("earliest");
  const [spanishSpeakingOnly, setSpanishSpeakingOnly] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);

  // get all events from route
  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      setEvents(
        data.map((event: IEvent) => ({
          ...event,
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // filter events based on settings
  const filteredEvents = events
    .filter((event) => {
      if (spanishSpeakingOnly) return event.spanishSpeakingAccommodation;
      return true;
    })
    .filter((event) => {
      const now = new Date();
      if (showPastEvents) return true;
      return new Date(event.startTime) >= now;
    })
    .filter((event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "earliest") {
        return (
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      } else {
        return (
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      }
    });

  return (
    <div className={style.mainContainer}>
      <aside className={style.sidebar}>
        <input
          type="text"
          placeholder="Search events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={style.searchBar}
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className={style.sortSelect}
        >
          <option value="earliest">Earliest First</option>
          <option value="latest">Latest First</option>
        </select>
        <div className={style.checkBoxes}>
          <div>
            <input
              type="checkbox"
              checked={showPastEvents}
              onChange={() => setShowPastEvents(!showPastEvents)}
            />{" "}
            Past Events
          </div>
          <div>
            <input
              type="checkbox"
              checked={spanishSpeakingOnly}
              onChange={() => setSpanishSpeakingOnly(!spanishSpeakingOnly)}
            />{" "}
            Spanish
          </div>
        </div>
      </aside>
      <div className={style.cardContainer}>
        <ul className={style.eventsList}>
          {filteredEvents.map((event) => (
            <li key={event._id} className={style.eventItem}>
              <div className={style.eventContainer}>
                <EventPreviewComponent event={event} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventPreview;
