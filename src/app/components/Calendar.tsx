"use client";
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ineractionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import style from "@styles/calendar/calendar.module.css";
import { Schema } from "mongoose";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "@styles/calendar/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { IEvent } from "@database/eventSchema";
import ExpandedViewComponent from "./StandaloneExpandedViewComponent";
import StandaloneCreateEvent from "./StandaloneCreateEvent";
import EventListRegister from "./EventList";

//FullCalendar Schema
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
  attendeeIds: Schema.Types.ObjectId[];
};

export default function Calendar(props: {
  events: FCEvent[] | [];
  admin: Boolean;
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
    attendeeIds: [],
  };
  const buttonType = { myCustomButton: {} };
  const [showModal, setShowModal] = useState(false);
  const [showEventList, setShowEventList] = useState(false);
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [getEvent, setEvent] = useState<IEvent | null>(null);

  const customButtons = props.admin ? {
    myCustomButton: {
      text: "Add Event",
      click: () => setShowModal(true),
      hint: "Add Event Button",
    }
  } : {};

  const headerToolbar = {
    left: "prev",
    center: "title",
    right: props.admin ? "next myCustomButton" : "next",
  };

  return (
    <div>
      <div className={style.wrapper}>
        <StandaloneCreateEvent
          showModal={showModal}
          setShowModal={setShowModal}
        ></StandaloneCreateEvent>
        <EventListRegister showModal={showEventList} setShowModal={setShowEventList}>
        </EventListRegister>
        <ExpandedViewComponent
          eventDetails={getEvent}
          showModal={showExpandedView}
          setShowModal={setShowExpandedView}
        ></ExpandedViewComponent>
        <FullCalendar
          customButtons={buttonType}
          plugins={[
            dayGridPlugin,
            ineractionPlugin,
            timeGridPlugin,
            bootstrap5Plugin,
            listPlugin,
          ]}
          headerToolbar={headerToolbar}
          events={props.events}
          nowIndicator={true}
          editable={true}
          droppable={true}
          selectable={true}
          selectMirror={true}
          // dateClick={{}}
          // drop={}
          eventClick={function (info) {
            let clickedEvent = props.dbevents.filter(
              (event) => event._id == info.event.id
            )[0];

            setEvent(clickedEvent);
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
