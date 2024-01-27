import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Event from "@database/eventSchema";

type IParams = {
  params: {
    eventId: string
  }
}

export async function GET(req: NextRequest, { params }: IParams) {
  await connectDB() // function from db.ts before
  const { eventId } = params // another destructure

   try {
        const event = await Event.findOne({ eventId }).orFail()
        return NextResponse.json(event)
    } catch (err) {
        return NextResponse.json('Event not found: ' + { eventId } , { status: 404 })
    }
}