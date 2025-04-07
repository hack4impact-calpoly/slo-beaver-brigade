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
  Text,
  Box,
  Input,
} from "@chakra-ui/react";
import Select from "react-select";
import { useEventsAscending } from "app/lib/swrfunctions";
import "../../fonts/fonts.css";

const EventPreview = () => {
  //states
  const { events, isLoading } = useEventsAscending();
  const [groupNames, setGroupNames] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<{ value: string; label: string }>({
    value: "earliest",
    label: "From Earliest",
  });
  const [spanishSpeakingOnly, setSpanishSpeakingOnly] = useState(false);
  const [wheelchairAccessible, setWheelchairAccessible] = useState(false);
  const [groupOnly, setGroupOnly] = useState(false);
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showFutureEvents, setShowFutureEvents] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [volunteerEvents, setVolunteerEvents] = useState(false);
  const [beaverWalk, setBeaverWalk] = useState(false);
  const [festivals, setFestivals] = useState(false);
  const [pondCleanup, setPondCleanup] = useState(false);

  // get string for some group based on id
  const fetchGroupName = async (groupId: string): Promise<string> => {
    try {
      const res = await fetch(`/api/groups/${groupId}`);
      if (res.ok) {
        const data = await res.json();
        return data.group_name;
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
        if (!events) {
          return;
        }
        const names: { [key: string]: string } = {};
        setLoading(true);
        await Promise.all(
          events.map(async (event: IEvent) => {
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
  const filteredEvents =
    events
      ?.filter((event) =>
        spanishSpeakingOnly ? event.spanishSpeakingAccommodation : true
      )
      .filter((event) =>
        wheelchairAccessible ? event.wheelchairAccessible : true
      )
      .filter((event) => (groupOnly ? event.groupsOnly : true))
      .filter((event) => {
        // display event if the checkbox is toggled and event type is toggled
        // if multiple checkboxes are toggled, display events for any of the types that are toggled
        if (
          (volunteerEvents && event.eventType === "Volunteer") ||
          (beaverWalk && event.eventType === "Beaver Walk") ||
          (festivals && event.eventType === "Festival") ||
          (pondCleanup && event.eventType === "Pond Clean Up")
        ) {
          return true;
        }
        // if none of the checkboxes are toggled, display all events
        else if (
          !volunteerEvents &&
          !beaverWalk &&
          !festivals &&
          !pondCleanup
        ) {
          return true;
        }
      })

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
        sortOrder.value === "earliest" // Check This!
          ? new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          : new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      ) || [];
  const sortOptions = [
    { value: "earliest", label: "From Earliest" },
    { value: "latest", label: "From Latest" },
  ];

  return (
    <div className={style.mainContainer}>
      <aside className={style.sidebar}>
        <div className={style.createAndSearchContainer}>
          <Link href={"/admin/events/create"}>
            <button className={style.yellowButton}>Create Event</button>
          </Link>
          <div className={style.searchWrapper}>
            <Input
              type="text"
              placeholder="Search Events"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={style.searchBar}
              focusBorderColor="#337774"
              borderColor="#337774"
              borderWidth="1.5px"
              _hover={{ borderColor: "#337774" }}
            />
            <MagnifyingGlassIcon
              style={{
                width: "20px",
                height: "20px",
                position: "absolute",
                margin: "auto",
                bottom: "10px",
                right: "10px",
                color: "#337774",
              }}
            />
          </div>
          <div className={style.searchWrapper}>
            <Select
              id="sort-select"
              value={sortOrder}
              options={sortOptions}
              onChange={(selectedOption) =>
                setSortOrder(
                  selectedOption || {
                    value: "earliest",
                    label: "From Earliest",
                  }
                )
              }
              className={style.sortSelect}
              isClearable={false}
              isSearchable={false}
              styles={{
                control: (provided) => ({
                  ...provided,
                  borderRadius: "12px",
                  height: "40px",
                  width: "200px",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "black",
                }),
                option: (provided, state) => ({
                  ...provided,
                  color: state.isSelected ? "white" : "black",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "black",
                }),
                menu: (provided) => ({
                  ...provided,
                  width: "150px",
                }),
              }}
            ></Select>
          </div>
        </div>
        <div className={style.filterGroupContainer}>
          <div className={style.filterContainer}>
            <div className={style.filterHeader}>Event Timeframe</div>
            <CheckboxGroup colorScheme="green" defaultValue={["true"]}>
              <Stack spacing={[1, 5]} direction={["column", "column"]} ml="1.5">
                {/** isChecked property does not work inside of CheckBoxGroup. Instead, set defaultValue == value */}
                <Checkbox
                  value="true"
                  colorScheme="blue"
                  onChange={() => setShowFutureEvents(!showFutureEvents)}
                >
                  <div className={style.checkboxLabel}>Future Events</div>
                </Checkbox>
                <Checkbox
                  value="false"
                  colorScheme="blue"
                  onChange={() => setShowPastEvents(!showPastEvents)}
                >
                  <div className={style.checkboxLabel}>Past Events</div>
                </Checkbox>
              </Stack>
            </CheckboxGroup>
          </div>
          <div className={style.filterContainerTypeAccessibility}>
            <div className={style.filterHeader}>Event Type</div>
            <CheckboxGroup colorScheme="green" defaultValue={[]}>
              <Stack spacing={[1, 5]} direction={["column", "column"]} ml="1.5">
                <Checkbox
                  value="beaver walk"
                  colorScheme="teal"
                  onChange={() => setBeaverWalk(!beaverWalk)}
                >
                  <div className={style.checkboxLabel}>Beaver Walk</div>
                </Checkbox>
                <Checkbox
                  value="volunteer"
                  colorScheme="yellow"
                  onChange={() => setVolunteerEvents(!volunteerEvents)}
                >
                  <div className={style.checkboxLabel}>Volunteer</div>
                </Checkbox>
                <Checkbox
                  value="festivals"
                  colorScheme="green"
                  onChange={() => setFestivals(!festivals)}
                >
                  <div className={style.checkboxLabel}>Festivals</div>
                </Checkbox>
                <Checkbox
                  value="pond clean up"
                  colorScheme="red"
                  onChange={() => setPondCleanup(!pondCleanup)}
                >
                  <div className={style.checkboxLabel}>Pond Clean Up</div>
                </Checkbox>
              </Stack>
            </CheckboxGroup>
          </div>
          <div className={style.filterContainerTypeAccessibility}>
            <div className={style.filterHeader}>Accessibility</div>
            <CheckboxGroup colorScheme="green" defaultValue={[]}>
              <Stack spacing={[1, 5]} direction={["column", "column"]} ml="1.5">
                <Checkbox
                  value="spanish"
                  colorScheme="blue"
                  onChange={() => setSpanishSpeakingOnly(!spanishSpeakingOnly)}
                >
                  <div className={style.checkboxLabel}>Spanish Speaking</div>
                </Checkbox>
                <Checkbox
                  value="wheelchair accessible"
                  colorScheme="blue"
                  onChange={() =>
                    setWheelchairAccessible(!wheelchairAccessible)
                  }
                >
                  <div className={style.checkboxLabel}>
                    Wheelchair Accessible
                  </div>
                </Checkbox>
                <Checkbox
                  value="group only"
                  colorScheme="blue"
                  onChange={() => setGroupOnly(!groupOnly)}
                >
                  <div className={style.checkboxLabel}>Group Only</div>
                </Checkbox>
              </Stack>
            </CheckboxGroup>
          </div>
        </div>
      </aside>
      {loading ? (
        <div className={style.cardContainer}>
          <Text fontFamily="Lato" fontSize="2xl" mt="5%" textAlign="center">
            Loading Events...
          </Text>
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
                    onClick={() => handleEventClick(event)}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={style.cardContainer}>
          <Text fontFamily="Lato" fontSize="2xl" mt="10%" textAlign="center">
            No Events Found
          </Text>
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
