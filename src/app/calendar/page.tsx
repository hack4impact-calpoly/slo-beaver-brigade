import React from 'react'
import Calendar from '@components/Calendar'
import style from "@styles/calendar/eventpage.module.css"




export default function Events() {
    

    return (
        <div className={style.page}>
            <header className={style.header}>
                <h1>Event Calendar</h1>
            </header>
            <main>
                <div>
                    <Calendar 
                    />
                </div>
            </main>
        </div>
    )
}