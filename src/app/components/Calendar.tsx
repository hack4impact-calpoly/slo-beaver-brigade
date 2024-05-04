"use client"
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import style from "@styles/calendar/calendar.module.css";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "@styles/calendar/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IEvent } from "@database/eventSchema";
import ExpandedViewComponent from "./StandaloneExpandedViewComponent";
import StandaloneCreateEvent from "./StandaloneCreateEvent";
import EventListRegister from "./EventList";
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
          showModal={showExpandedView}
          setShowModal={setShowExpandedView}
        />
        <FullCalendar
          customButtons={{
            myCustomButton: {
              text: "Add Event",
              click: () => setShowModal(true),
              hint: "Add Event Button",
            },
          }}
          plugins={[
            dayGridPlugin,
            interactionPlugin,
            timeGridPlugin,
            bootstrap5Plugin,
            listPlugin,
          ]}
          headerToolbar={{
            left: "prev",
            center: "title",
            right: props.admin ? "next myCustomButton" : "next",
          }}
          events={props.events}
          nowIndicator={true}
          editable={true}
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
          themeSystem="bootstrap5"
          eventDisplay="block"
        />
      </div>
    </div>
  );
}
