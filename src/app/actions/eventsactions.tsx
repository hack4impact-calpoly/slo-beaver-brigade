'use server'

import connectDB from "@database/db";
import Event from "@database/eventSchema"

export const getEvents = async (offset: number, limit: number) => {
    await connectDB(); // connect to db

    try {
        // query for all events and sort by date
        let events = null
        if (limit <= 0 && offset <= 0){
            events = await Event.find().sort({startTime: -1}).orFail();
        }
        else if (limit <= 0){
            events = await Event.find().skip(offset).sort({ startTime: -1 }).orFail();
        }
        else if (offset <= 0){
            events = await Event.find().limit(limit).sort({startTime: -1}).orFail()
        }
        else{
            events = await Event.find().skip(offset).limit(limit).sort({ startTime: -1 }).orFail();
        }
        return JSON.stringify(events);
    } catch (err) {
        return null;
    }
}

export async function getSelectedEvents(selectedFilters: string[]) {
  await connectDB(); // connect to db
  try {
    let query = Event.find().sort({ date: -1 });

    // Apply filters if any selected
    if (selectedFilters.length > 0) {
      query = query.where("eventType").in(selectedFilters);
    }

    // Execute the query
    const events = await query.exec();

    // returns all events in json format or errors
    return JSON.stringify(events);
  } catch (err) {
    return "[]";
  }
}
