import React from 'react'
import Calendar from 'app/components/calendar/Calendar'
import style from "@styles/calendar/eventpage.module.css"
import { Calendarify } from 'app/lib/calendar';
import Event from "@database/eventSchema"
import connectDB from '@database/db';

async function getEvents() {
  await connectDB(); // connect to db
  try {
    // query for all events and sort by date
    const events = await Event.find().sort({ date: -1 }).orFail();
    // returns all events in json format or errors
    return events;
  } catch (err) {
    return [];
  }
}

export default async function dashboard(){
  const events = await getEvents();
  if (events == null) {
    return (
      <div className={style.page}>
          <header className={style.header}>
              <h1>Event Calendar</h1>
          </header>
          <main>
              <div>
                  <h1>There are no events to display</h1>
              </div>
          </main>
      </div>
    )
  }
  const calEvent = events.map(Calendarify)

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


