'use server'

import connectDB from "@database/db";
import Event from "@database/eventSchema"

export const getEvents = async (offset: number, limit: number) => {
    await connectDB(); // connect to db

    const currentDate = new Date();
    try {
        let events = null;
        // query for all events and sort by date
        if (offset < 0){
            // query upcoming events
            events = await Event.find({startTime: {$gte : currentDate}}).sort({startTime: 1})
        }
        else{
            events = await Event.find({startTime: {$lt: currentDate}}).skip(offset).limit(limit).sort({ date: -1 }).orFail();
            console.log(events)
        }
        return JSON.stringify(events);
    } catch (err) {
        return null;
    }
}