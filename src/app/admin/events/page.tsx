"use client";
import React, { useEffect, useState } from "react";
import style from "@styles/admin/events.module.css";
import EventPreviewComponent from "@components/EventPreview";
import { ObjectId } from "mongoose";

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
  groupsAllowed: ObjectId[];
  attendeeIds: ObjectId[];
  digitalWaiver: string | null;
}

const EventPreview = () => {
  //states
  const [events, setEvents] = useState<IEvent[]>([]);
  const [groupNames, setGroupNames] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("earliest");
  const [spanishSpeakingOnly, setSpanishSpeakingOnly] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [loading, setLoading] = useState(true);

  // get string for some group based on id
  const fetchGroupName = async (groupId: ObjectId): Promise<string> => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        return data.group.group_name;
      } else {
        console.error("Error fetching group name:", res.statusText);
        return "SLO Beaver Brigade";
      }
    } catch (error) {
      console.error("Error fetching group name:", error);
      return "SLO Beaver Brigade";
    }
  };

  // grab all events from route
  useEffect(() => {
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

        // fetch group names for all events right after events are fetched
        const names: { [key: string]: string } = {};
        for (const event of data) {
          if (event.groupsAllowed.length > 0) {
            setLoading(true);
            const groupName = await fetchGroupName(event.groupsAllowed[0]);
            names[event._id] = groupName;
            setLoading(false);
          } else {
            names[event._id] = "SLO Beaver Brigade";
          }
        }
        setGroupNames(names);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, []);

  // filtering events logic
  const filteredEvents = events
    .filter((event) =>
      spanishSpeakingOnly ? event.spanishSpeakingAccommodation : true
    )
    .filter((event) =>
      showPastEvents ? true : new Date(event.startTime) >= new Date()
    )
    .filter((event) =>
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "earliest"
        ? new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        : new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

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
      {loading ? (
        <div>Loading events...</div>
      ) : (
        <div className={style.cardContainer}>
          <ul className={style.eventsList}>
            {filteredEvents.map((event) => (
              <li key={event._id} className={style.eventItem}>
                <EventPreviewComponent
                  event={event}
                  groupName={groupNames[event._id]}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventPreview;
