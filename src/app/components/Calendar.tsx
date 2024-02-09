'use client'
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import ineractionPlugin, {Draggable, DropArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from "@fullcalendar/list"
import style from "@styles/calendar/calendar.module.css"
import { Schema } from "mongoose";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

//FullCalendar Schema
export type FCEvent = {
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


export default function Calendar (props : {events : FCEvent[], admin: Boolean}) {

    const buttonType = {myCustomButton:{}}

    if (props.admin){
         buttonType.myCustomButton = {
                text: 'Add Event',
                click: function() {
                    alert('Add Events!');
                },
                hint: "Add Event Button"
            }
    }
    else {
        buttonType.myCustomButton = {
            text: 'Sign Up',
            click: function() {
                alert('Sign Up!');
            },
            hint: "Sign Up Button"
        }
    }

  
    return (
        <div>
            <div className={style.wrapper}>
                <FullCalendar
                    customButtons={buttonType}
                    plugins={[ dayGridPlugin, ineractionPlugin, timeGridPlugin, bootstrap5Plugin ]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'myCustomButton dayGridMonth,timeGridWeek'
                    }}
                    events={props.events}
                    nowIndicator={true}
                    editable={true}
                    droppable={true}
                    selectable={true}
                    selectMirror={true}
                    
                    // dateClick={{}}
                    // drop={}
                    // eventClick={}
                    initialView="dayGridMonth"
                    contentHeight = "650px"
                    themeSystem='bootstrap5'
                    eventDisplay='block'    
                    
                    />
            </div>
        </div>
    )
  
}