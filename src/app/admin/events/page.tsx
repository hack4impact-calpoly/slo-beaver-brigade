import React from 'react'
import Calendar from '@components/Calendar'
import style from "@styles/calendar/eventpage.module.css"
import { Calendarify, getEvents } from 'app/calendar/page';


export default async function dashboard(){
  let calEvent = [];
  const events = await getEvents();
  if(events){
    calEvent = events.map(Calendarify)
  }

  //Ievent object to pass into calendar component
  const dbEvent = JSON.parse(JSON.stringify(events));


  return (
    <div className={style.page}>
        <header className={style.header}>
            <h1>Event Calendar</h1>
        </header>
        <main>
            <div>
                <Calendar events={calEvent} admin={true} dbevents={dbEvent}
                />
            </div>
        </main>
    </div>
  )
};


