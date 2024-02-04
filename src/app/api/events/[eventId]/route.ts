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

   try {
        const event = await Event.findOne({ eventId }).orFail()
        return NextResponse.json(event)
    } catch (err) {
        return NextResponse.json('Event not found: ' + { eventId } , { status: 404 })
    }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
  await connectDB() // connect to db
  const { eventId } = params // another destructure

  try {
    await Event.deleteOne({ eventId })
    return NextResponse.json('Event deleted: ' + { eventId }, { status: 200 })
  } catch (err) {
    return NextResponse.json('Event not deleted: ' + { eventId } + err, { status: 400 })
  }
}

export async function PATCH(req: NextRequest, { params }: IParams) {
  await connectDB() // connect to db
  const { eventId } = params // another destructure

  try {
    const event = await Event.findOne({ eventId }).orFail();
    if (req.body){
      //strip Event data from req json
      const { eventName, description, wheelchairAccessible, spanishSpeakingAccommodation, date, volunteerEvent, attendeeIds }: IEvent = await req.json()
      if (eventName) {event.eventName = eventName}
      if (description) {event.description = description}
      if (wheelchairAccessible) {event.wheelchairAccessible = wheelchairAccessible}
      if (spanishSpeakingAccommodation) {event.spanishSpeakingAccommodation = spanishSpeakingAccommodation}
      if (date) {event.date = date}
      if (volunteerEvent) {event.volunteerEvent = volunteerEvent}
      if (attendeeIds) {event.attendeeIds = attendeeIds}
    }
    await event.save()
    return NextResponse.json('Event updated: ' + { event }, { status: 200 })
  } catch (err) {
    return NextResponse.json('Event not updated: ' + { eventId } + err, { status: 400 })
  }
}