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
import CreateEvent from "./StandaloneCreateEvent";
import EventExpandedView from "./ExpandedViewComponent";
import { IEvent } from "@database/eventSchema";

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
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [getEvent, setEvent] = useState<IEvent>(placeHolderEvent);

  if (props.admin) {
    buttonType.myCustomButton = {
      text: "Add Event",
      click: function () {
        setShowModal(true);
      },
      hint: "Add Event Button",
    };
  } else {
    buttonType.myCustomButton = {
      text: "Sign Up",
      click: function () {
        alert("Sign Up!");
      },
      hint: "Sign Up Button",
    };
  }

  return (
    <div>
      <div className={style.wrapper}>
        <CreateEvent
          showModal={showModal}
          setShowModal={setShowModal}
        ></CreateEvent>
        <EventExpandedView
          eventDetails={getEvent}
          showModal={showExpandedView}
          setShowModal={setShowExpandedView}
        ></EventExpandedView>
        <FullCalendar
          customButtons={buttonType}
          plugins={[
            dayGridPlugin,
            ineractionPlugin,
            timeGridPlugin,
            bootstrap5Plugin,
            listPlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "myCustomButton dayGridMonth,listMonth",
          }}
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
