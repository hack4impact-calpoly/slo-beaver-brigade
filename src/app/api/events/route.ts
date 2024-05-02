import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Event, { IEvent } from "@database/eventSchema";

export async function GET() {
    await connectDB(); // connect to db

    try {
        // query for all events and sort by date
        const events = await Event.find().sort({ date: -1 }).orFail();
        // returns all events in json format or errors
        return NextResponse.json(events, { status: 200 });
    } catch (err) {
        return NextResponse.json("Failed to fetch events: " + err, {
            status: 400,
        });
    }
}

// export async function POST(req: NextRequest) {
//   await connectDB() // connect to db

//   //strip Event data from req json
//   const { eventName, description, wheelchairAccessible, spanishSpeakingAccommodation, startTime, endTime, volunteerEvent, groupsAllowed, registeredIds }: IEvent = await req.json()

//   //create new event or return error
//   try {
//     const newEvent = new Event({ eventName, description, wheelchairAccessible, spanishSpeakingAccommodation, startTime, endTime, volunteerEvent, groupsAllowed, registeredIds })
//     await newEvent.save()
//     return NextResponse.json("Event added successfull: " + newEvent, { status: 200 });
//   } catch (err) {
//     return NextResponse.json("Event not added: " + err, { status: 400 });
//   }
// }

export async function POST(req: NextRequest) {
    await connectDB();
    console.log("Connected to Db");

    const event: IEvent = await req.json();

    // create new event or return error
    try {
        const newEvent = new Event(event);
        newEvent.volunteerEvent = (newEvent.eventType === "Volunteer");
        console.log("New Event Data:", newEvent); // Add this line

        await newEvent.save();
        return NextResponse.json("Event added successfully: " + newEvent, {
            status: 200,
        });
    } catch (err: any) {
        console.error("Error creating event:", err); // Add this line

        if (err.name === "ValidationError") {
            // Handle validation errors
            const errors = Object.values(err.errors).map(
                (error: any) => error.message
            );
            return NextResponse.json("Validation error: " + errors.join(", "), {
                status: 400,
            });
        } else {
            return NextResponse.json("Event not added: " + err, {
                status: 400,
            });
        }
    }
}
