import connectDB from "database/db";
import { SortOrder } from "mongoose";
import { NextResponse } from "next/server";
import Event from "database/eventSchema";

export async function GET(request: Request) {
    await connectDB(); // connect to db
    const { searchParams } = new URL(request.url);
    let sort: SortOrder = 1;

    try {
        // query for all events and sort by date
        const events = await Event.find().sort({ startTime: sort }).orFail();
        // returns all events in json format or errors
        return NextResponse.json(events, { status: 200 });
    } catch (err) {
        return NextResponse.json("Failed to fetch events: " + err, {
            status: 400,
        });
    }
}
