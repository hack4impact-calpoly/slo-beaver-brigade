import React from 'react'
import Calendar from '@components/Calendar'
import style from "@styles/calendar/eventpage.module.css"
import { Calendarify, getEvents } from 'app/calendar/page';


export default async function dashboard(){
  const events = await getEvents();
  const calEvent = events.map(Calendarify)

  return (
    <div className={style.page}>
        <header className={style.header}>
            <h1>Event Calendar</h1>
        </header>
        <main>
            <div>
                <Calendar events={calEvent} admin={true}
                />
            </div>
        </main>
    </div>
  )
};


