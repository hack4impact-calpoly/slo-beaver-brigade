'use server'

import connectDB from "@database/db";
import Event from "@database/eventSchema"

export const getEvents = async() => {
    await connectDB(); // connect to db

    try {
        // query for all events and sort by date
        const events = await Event.find().sort({ date: -1 }).orFail();
        return events;
    } catch (err) {
        return [];
    }
}