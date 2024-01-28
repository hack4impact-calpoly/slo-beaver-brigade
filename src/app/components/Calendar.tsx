import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' 
import ineractionPlugin, {Draggable, DropArg} from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from "@fullcalendar/list"
import {IEvent} from '@database/eventSchema'
import style from "@styles/calendar/calendar.module.css"
import styled from 'styled-components'

export const StyleWrapper = styled.div
`
  .fc td {
    background: red;
  }
`

export default function Calendar () {
  
    return (
        <div>
            <div className={style.wrapper}>
                <FullCalendar
                    plugins={[ dayGridPlugin, ineractionPlugin, timeGridPlugin ]}
                    headerToolbar={{
                        left: 'prev, next today',
                        center: 'title',
                        right: 'dayGridMonth, timeGridWeek'
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
                    
                    

                    />
            </div>
            
        </div>
    )
  
}