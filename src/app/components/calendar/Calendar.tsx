"use client"
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import style from "@styles/calendar/calendar.module.css";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IEvent } from "@database/eventSchema";
import ExpandedViewComponent from "../StandaloneExpandedViewComponent";
import StandaloneCreateEvent from "../StandaloneCreateEvent";
import EventListRegister from "../EventList";
import { Schema } from "mongoose";

// FullCalendar Schema
export type FCEvent = {
  id: string;
  title: string;
  location: string;
  description: string;
  wheelchairAccessible: boolean;
  spanishSpeakingAccommodation: boolean;
  start: Date;
  end: Date;
  startTime: Date;
  endTime: Date;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  volunteerEvent: boolean;
  groupsAllowed: number[];
  registeredIds: Schema.Types.ObjectId[];
};

export default function Calendar(props: {
  events: FCEvent[] | [];
  admin: boolean; // Updated admin to boolean
  dbevents: IEvent[];
}) {
  const placeHolderEvent = {
    _id: "",
    eventName: "",
    location: "",
    description: "",
    wheelchairAccessible: false,
    spanishSpeakingAccommodation: false,
    startTime: new Date("2024-02-17T17:30:00.000+00:00"),
    endTime: new Date("2024-02-17T17:30:00.000+00:00"),
    volunteerEvent: false,
    groupsAllowed: [],
    registeredIds: [],
  };
  const [showModal, setShowModal] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [getEvent, setEvent] = useState<IEvent | null>(null);
  
  return (
    <div>
      <div className={style.wrapper}>
        <StandaloneCreateEvent
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <EventListRegister
          showModal={showEventList}
          setShowModal={setShowEventList}
        />
        <ExpandedViewComponent
          eventDetails={getEvent}
          editUrl={getEvent?._id}
          showModal={showExpandedView}
          setShowModal={setShowExpandedView}
        />
        <FullCalendar
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            bootstrap5Plugin,
            listPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            end: "",
            start: "",
            right: "timeGridWeek,dayGridMonth"
          }}
          events={props.events}
          nowIndicator={true}
          editable={false}
          droppable={true}
          selectable={true}
          selectMirror={true}
          eventClick={(info) => {
            const clickedEvent = props.dbevents.find(
              (event) => event._id === info.event.id
            );
            setEvent(clickedEvent || null);
            setShowExpandedView(true);
          }}
          initialView="dayGridMonth"
          contentHeight="600px"
          eventDisplay="block"
        />
      </div>
    </div>
  );
}
