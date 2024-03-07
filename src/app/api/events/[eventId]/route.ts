import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Event, { IEvent } from "@database/eventSchema";

type IParams = {
  params: {
    eventId: string
  }
}

export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB() // connect to db
  const { eventId } = params // another destructure
  console.log(eventId)

   try {
        const event = await Event.findById( eventId ).orFail()
        return NextResponse.json(event)
    } catch (err) {
        return NextResponse.json('Event not found (EventId = ' + eventId + ") " + err, { status: 404 })
    }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB() // connect to db
  const { eventId } = params // another destructure

  try {
    const event = await Event.findById( eventId ).orFail()
    await Event.deleteOne({ event })
    return NextResponse.json('Event deleted: ' + event, { status: 200 })
  } catch (err) {
    return NextResponse.json('Event not deleted (EventId = ' + eventId + ") "+ err, { status: 400 })
  }
}

export async function PATCH(req: NextRequest, { params }: IParams) {
  await connectDB() // connect to db
  const { eventId } = params // another destructure

  try {
    const event = await Event.findById( eventId ).orFail();
    if (req.body){
      //strip Event data from req json
      const { eventName, location, description, date, startTime, endTime, type, wheelchairAccessible, spanishSpeakingAccommodation,  volunteerEvent, groupsAllowed, attendeeIds }: IEvent = await req.json()
      if (eventName) {event.eventName = eventName}
      if (location) {event.location = location}
      if (description) {event.description = description}
      if (date) {event.date = date}
      if (startTime) {event.startTime = startTime}
      if (endTime) {event.endTime = endTime}
      if (type) {event.type = type}
      if (wheelchairAccessible) {event.wheelchairAccessible = wheelchairAccessible}
      if (spanishSpeakingAccommodation) {event.spanishSpeakingAccommodation = spanishSpeakingAccommodation}
      if (volunteerEvent) {event.volunteerEvent = volunteerEvent}
      if (groupsAllowed) {event.groupsAllowed = groupsAllowed}
      if (attendeeIds) {event.attendeeIds = attendeeIds}
    }
    await event.save()
    return NextResponse.json('Event updated: ' + event, { status: 200 })
  } catch (err) {
    return NextResponse.json('Event not updated (EventId = ' + eventId + ") " + err, { status: 400 })
  }
}