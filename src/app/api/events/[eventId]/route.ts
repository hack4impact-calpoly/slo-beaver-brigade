import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Event, { IEvent } from "@database/eventSchema";

type IParams = {
    params: {
        eventId: string;
    };
};

export async function GET(req: NextRequest, { params }: IParams) {
    await connectDB(); // connect to db
    const { eventId } = params; // another destructure
    try {
        const event = await Event.findById(eventId).orFail();
        return NextResponse.json(event);
    } catch (err) {
        return NextResponse.json(
            "Event not found (EventId = " + eventId + ") " + err,
            { status: 404 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: IParams) {
    await connectDB(); // connect to db
    const { eventId } = params; // another destructure

    try {
        const event = await Event.findByIdAndDelete(eventId).orFail();
        return NextResponse.json("Event deleted: " + eventId, {
            status: 200,
        });
    } catch (err) {
        return NextResponse.json(
            "Event not deleted (EventId = " + eventId + ") " + err,
            { status: 400 }
        );
    }
}

/** add user to atendee id */
export async function PUT(req: NextRequest, { params }: IParams) {
    await connectDB(); // connect to db
    const { eventId } = params; // another destructure
    const { userId } = await req.json();
    try {
        const event = await Event.findById(eventId).orFail();
        event.attendeeIds.push(userId);
        await event.save();
        return NextResponse.json("User added to event: " + event, {
            status: 200,
        });
    } catch (err) {
        return NextResponse.json(
            "User not added to event (EventId = " + eventId + ") " + err,
            { status: 400 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: IParams) {
    await connectDB(); // connect to db
    const { eventId } = params; // another destructure

    try {
        const event = await Event.findById(eventId).orFail();
        if (req.body) {
            //strip Event data from req json
            console.log(req.body);
            const {
                eventName,
                location,
                description,
                startTime,
                endTime,
                wheelchairAccessible,
                spanishSpeakingAccommodation,
                volunteerEvent,
                groupsAllowed,
                attendeeIds,
            }: IEvent = await req.json();
            if (location) {
                event.location = location;
            }
            if (eventName) {
                event.eventName = eventName;
            }
            if (description) {
                event.description = description;
            }
            if (startTime) {
                event.startTime = startTime;
            }
            if (endTime) {
                event.endTime = endTime;
            }
            if (wheelchairAccessible) {
                event.wheelchairAccessible = wheelchairAccessible;
            }
            if (spanishSpeakingAccommodation) {
                event.spanishSpeakingAccommodation =
                    spanishSpeakingAccommodation;
            }
            if (volunteerEvent) {
                event.volunteerEvent = volunteerEvent;
            }
            if (groupsAllowed) {
                event.groupsAllowed = groupsAllowed;
            }
            if (attendeeIds) {
                event.attendeeIds = attendeeIds;
            }
        }
        await event.save();
        return NextResponse.json("Event updated: " + event, { status: 200 });
    } catch (err) {
        console.error("Error updating event (EventId = " + eventId + "):", err);
        return NextResponse.json(
            "Event not updated (EventId = " + eventId + ") " + err,
            { status: 400 }
        );
    }
}
