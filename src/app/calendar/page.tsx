import React from 'react'
import Calendar from '@components/Calendar'
import {IEvent} from '@database/eventSchema'
import style from "@styles/calendar/eventpage.module.css"

//gets events from api endpoint
export async function getEvents() {
  const res = await fetch(`http://localhost:3000/api/events`,
  {
    cache:"no-store"
  });

  if(res.ok){
    return res.json()
  }
  return null
}

  //converts an event into a FullCalendar event
  export function Calendarify(event : IEvent) {
    //convert events into plain object before passing into client component
    const calEvent = JSON.parse(JSON.stringify(event));

    calEvent.title = event.eventName;
    delete calEvent.eventName;
    calEvent.start = event.startTime;
    calEvent.end = event.endTime;

    if(event.eventName == "Beaver Walk"){
      calEvent.backgroundColor = "#8A6240"
      calEvent.borderColor = "#4D2D18"
      calEvent.textColor = "#fff"
    }
    else{
      calEvent.backgroundColor = "#0077b6"
      calEvent.borderColor = "#03045e"
      calEvent.textColor = "#fff"
    }

    return calEvent
  }

export default async function Events() {
  let calEvent = [];
  const events = await getEvents();
  if(events){
    calEvent = events.map(Calendarify)
  }
   

  return (
    <div className={style.page}>
        <header className={style.header}>
            <h1>Event Calendar</h1>
        </header>
        <main>
            <div>
                <Calendar events={calEvent} admin={false}
                />
            </div>
        </main>
    </div>
  )
}