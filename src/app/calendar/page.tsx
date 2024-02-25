import React from 'react'
import Calendar from '@components/Calendar'
import Event,{IEvent} from '@database/eventSchema'
import style from "@styles/calendar/eventpage.module.css"
import connectDB from '@database/db'

export async function getEvents() {
  await connectDB() // connect to db
  try {
    // query for all events and sort by date
    const events = await Event.find().sort({ date: -1 }).orFail()
    // returns all events in json format or errors
      return events;
   } catch (err) {
      return [];
   }
 }

  //converts an event into a FullCalendar event
  export function Calendarify(event : IEvent) {
    //convert events into plain object before passing into client component
    const calEvent = JSON.parse(JSON.stringify(event));
    calEvent.title = event.eventName;
    delete calEvent.eventName;
    calEvent.start = event.startTime;
    calEvent.end = event.endTime;
    calEvent.id = event._id;

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
  const events = await getEvents();
  let calEvent = events.map(Calendarify)
  
  //Ievent object to pass into calendar component
  const dbEvent = JSON.parse(JSON.stringify(events));
   

  return (
    <div className={style.page}>
        <header className={style.header}>
            <h1>Event Calendar</h1>
        </header>
        <main>
            <div>
                <Calendar events={calEvent} admin={false} dbevents={dbEvent}
                />
            </div>
        </main>
    </div>
  )
}