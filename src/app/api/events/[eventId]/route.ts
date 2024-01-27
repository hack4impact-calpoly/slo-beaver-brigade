import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
// import { Event } from "@models/event";

type IParams = {
  params: {
    eventName: string
  }
}

export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB() // function from db.ts before
  const { eventName } = params // another destructure

   try {
        const event = await Event.findOne({ eventName }).orFail()
        return NextResponse.json(event)
    } catch (err) {
        return NextResponse.json('Event not found: ' + {eventName} , { status: 404 })
    }
}