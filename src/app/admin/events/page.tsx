"use client";
import React, { useEffect, useState } from "react";
import style from "@styles/admin/events.module.css";
import EventPreviewComponent from "@components/EventCard";
import ExpandedTest from "@components/StandaloneExpandedViewComponent";
import { ObjectId } from "mongoose";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { getEvents } from "app/actions/eventsactions";
import { IEvent } from "@database/eventSchema";
import {
  Checkbox,
  CheckboxGroup,
  Stack,
  Box
} from "@chakra-ui/react";
import { getAllImagesS3 } from "app/actions/imageactions";

// interface IEvent {
//   _id: string;
//   eventName: string;
//   location: string;
//   description: string;
//   wheelchairAccessible: boolean;
//   spanishSpeakingAccommodation: boolean;
//   startTime: Date;
//   endTime: Date;
//   volunteerEvent: boolean;
//   visitorCount?: number;
//   groupsAllowed: ObjectId[];
//   registeredIds: ObjectId[];
//   digitalWaiver: string | null;
// }

const EventPreview = () => {
  //states
  const [events, setEvents] = useState<IEvent[]>([]);
  const [groupNames, setGroupNames] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("earliest");
  const [spanishSpeakingOnly, setSpanishSpeakingOnly] = useState(false);
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showFutureEvents, setShowFutureEvents] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  
  const [volunteerEvents, setVolunteerEvents] = useState(false);
  const [wateryWalk, setWateryWalk] = useState(false);
  const [specialEvents, setSpecialEvents] = useState(false);


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
        const res = await getEvents(-1, -1)
        if (!res){
            console.log("Error getting events.")
            return;
        }
        const data = JSON.parse(res)
        console.log(data)
        setEvents(
          data.map((event: IEvent) => ({
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime),
            groupsAllowed: event.groupsAllowed || [],
          }))
        );

        const names: { [key: string]: string } = {};
        setLoading(true);
        await Promise.all(
          data.map(async (event: IEvent) => {
            if (event.groupsAllowed && event.groupsAllowed.length > 0) {
              const groupName = await fetchGroupName(event.groupsAllowed[0]);
              names[event._id] = groupName;
            } else {
              names[event._id] = "SLO Beaver Brigade";
            }
          })
        );
        setGroupNames(names);
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  // open standAloneComponent on click
  const handleEventClick = (event: IEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // filtering events logic
  const filteredEvents = events
    .filter((event) =>
      spanishSpeakingOnly ? event.spanishSpeakingAccommodation : true
    )
    .filter((event) =>
      wheelchairAccessible ? event.wheelchairAccessible : true
    )
    .filter((event) =>
      volunteerEvents ? event.eventType === "Volunteer" : true
    )

    .filter((event) =>
      wateryWalk ? event.eventType === "Watery Walk" : true
    )

    .filter((event) =>
      specialEvents ? event.eventType === "Special Events" : true
    )

    
    .filter((event) => {
      const eventDate = new Date(event.startTime);
      const now = new Date();
      if (showFutureEvents && showPastEvents) {
        return true;
      } else if (showFutureEvents) {
        return eventDate >= now;
      } else if (showPastEvents) {
        return eventDate <= now;
      }
      return true;
    })
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
        <div className={style.createAndSearchContainer}>
          <Link href={"/admin/events/create"}>
            <button className={style.yellowButton}>Create Event</button>
          </Link>
          <div className={style.searchWrapper}>
            <input
              type="text"
              placeholder="Search Events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={style.searchBar}
            />
            <MagnifyingGlassIcon
              style={{
                width: "15px",
                height: "15px",
                position: "absolute",
                margin: "auto",
                bottom: "11px",
                right: "10px",
                color: "#337774"
              }}
            />
          </div>
        </div>
        <div>
          <div className={style.filterContainer}>
            <div className={style.filterHeader}>Event Timeframe</div>
            <CheckboxGroup colorScheme="green" defaultValue={["true"]}>
              <Stack spacing={[1, 5]} direction={["column", "column"]} ml="1.5">
                  {/** isChecked property does not work inside of CheckBoxGroup. Instead, set defaultValue == value */}
                <Checkbox value="true" colorScheme="teal"
                  onChange={() => setShowFutureEvents(!showFutureEvents)}>
                    <div className={style.checkboxLabel}>Future Events</div>
                </Checkbox>
                <Checkbox value="false" colorScheme="yellow"
                  onChange={() => setShowPastEvents(!showPastEvents)}>
                    <div className={style.checkboxLabel}>Past Events</div>
                </Checkbox>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className={style.sortSelect}
                  >
                    <option value="earliest">From Earliest</option>
                    <option value="latest">From Latest</option>
                </select>
              </Stack>
            </CheckboxGroup>
          </div>
          <div className={style.filterContainer}>
            <div className={style.filterHeader}>Event Type</div>
            <CheckboxGroup colorScheme="green" defaultValue={[]}>
              <Stack spacing={[1, 5]} direction={["column", "column"]} ml="1.5">
                <Checkbox value="watery walk" colorScheme="teal"
                  onChange={() => setWateryWalk(!wateryWalk)}>
                    <div className={style.checkboxLabel}>Watery Walk</div>
                </Checkbox>
                <Checkbox value="volunteer" colorScheme="yellow"
                  onChange={() => setVolunteerEvents(!volunteerEvents)}>
                    <div className={style.checkboxLabel}>Volunteer</div>
                </Checkbox>
                <Checkbox value="special events" colorScheme="green"
                  onChange={() => setSpecialEvents(!specialEvents)}>
                    <div className={style.checkboxLabel}>Special Events</div>
                </Checkbox>
              </Stack>
            </CheckboxGroup>
          </div>
          <div className={style.filterContainer}>
            <div className={style.filterHeader}>Accessibility</div>
            <CheckboxGroup colorScheme="green" defaultValue={[]}>
              <Stack spacing={[1, 5]} direction={["column", "column"]} ml="1.5">

                <Checkbox value="spanish" colorScheme="teal"
                  onChange={() => setSpanishSpeakingOnly(!spanishSpeakingOnly)}>
                    <div className={style.checkboxLabel}>Spanish Speaking</div>
                </Checkbox>
                <Checkbox value="wheelchair accessible" colorScheme="yellow"
                  onChange={() => setWheelchairAccessible(!wheelchairAccessible)}>
                    <div className={style.checkboxLabel}>Wheelchair Accessible</div>
                </Checkbox>
              </Stack>
            </CheckboxGroup>
          </div>
        </div> 
        
      </aside>
      {loading ? (
        <div className={style.cardContainer}>
          <div className={style.emptyStateText}>
          Loading events...
          </div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className={style.cardContainer}>
          <ul className={style.eventsList}>
            {filteredEvents.map((event) => (
              <li key={event._id} className={style.eventItem}>
                <Link href={"/admin/events/edit/" + event._id}>
                <EventPreviewComponent
                  event={event}
                  groupName={groupNames[event._id]}
                  onClick={() => console.log()}
                /></Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={style.cardContainer}>
          <div className={style.emptyStateText}>No events to show</div>
        </div>
      )}
      {selectedEvent && (
        <ExpandedTest
          eventDetails={selectedEvent}
          showModal={isModalOpen}
          setShowModal={setIsModalOpen}
        />
      )}
    </div>
  );
};

export default EventPreview;
