import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Event, { IEvent } from "@database/eventSchema";


export async function GET() {
  await connectDB() // connect to db

	try {
			// query for all events and sort by date
	    const events = await Event.find().sort({ date: -1 }).orFail()
      console.log(events)
			// returns all events in json format or errors
	    return NextResponse.json(events, { status: 200 });
	} catch (err) {
    return NextResponse.json("Failed to fetch events: " + err, { status: 400 });
	}
}

export async function POST(req: NextRequest) {
  await connectDB() // connect to db

  //strip Event data from req json
  const { eventName, description, wheelchairAccessible, spanishSpeakingAccommodation, startTime, endTime, volunteerEvent, groupsAllowed, attendeeIds }: IEvent = await req.json()
  
  //create new event or return error
  try {
    const newEvent = new Event({ eventName, description, wheelchairAccessible, spanishSpeakingAccommodation, startTime, endTime, volunteerEvent, groupsAllowed, attendeeIds })
    await newEvent.save()
    return NextResponse.json("Event added successfull: " + newEvent, { status: 200 });
  } catch (err) {
    return NextResponse.json("Event not added: " + err, { status: 400 });
  }
}


