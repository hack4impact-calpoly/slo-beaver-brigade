import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import ineractionPlugin, {Draggable, DropArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from "@fullcalendar/list"
import {IEvent} from '@database/eventSchema'
import style from "@styles/calendar/calendar.module.css"
import styled from 'styled-components'
import bootstrap5Plugin from '@fullcalendar/bootstrap5';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // needs additional webpack config!


export default function Calendar () {
  
    return (
        <div>
            <div className={style.wrapper}>
                <FullCalendar
                    plugins={[ dayGridPlugin, ineractionPlugin, timeGridPlugin, bootstrap5Plugin ]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={{}}
                    nowIndicator={true}
                    editable={true}
                    droppable={true}
                    selectable={true}
                    selectMirror={true}
                    // dateClick={{}}
                    // drop={}
                    // eventClick={}
                    initialView="dayGridMonth"
                    contentHeight = "600px"
                    themeSystem='bootstrap5'
                    
                    />
            </div>
            
        </div>
    )
  
}