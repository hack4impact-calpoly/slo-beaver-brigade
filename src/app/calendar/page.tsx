import React from 'react'
import Calendar from '@components/Calendar'
import style from "@styles/calendar/eventpage.module.css"




export default async function Events() {
  async function getEvents() {
    const res = await fetch(`http://localhost:3000/api/events`,
    {
      cache:"no-store"
    });
  
    if(res.ok){
      return res.json()
    }
    return null
  }

  const events = await getEvents();
  const clientEvents = JSON.parse(JSON.stringify(events))



  return (
    <div className={style.page}>
        <header className={style.header}>
            <h1>Event Calendar</h1>
        </header>
        <main>
            <div>
                <Calendar events={clientEvents}
                />
            </div>
        </main>
    </div>
  )
}