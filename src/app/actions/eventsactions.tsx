'use server'

import connectDB from "@database/db";
import Event from "@database/eventSchema"

export const getEvents = async (offset: number, limit: number) => {
    await connectDB(); // connect to db

    try {
        // query for all events and sort by date
        const events = await Event.find().skip(offset).limit(limit).sort({ date: -1 }).orFail();
        return JSON.stringify(events);
    } catch (err) {
        return null;
    }
}