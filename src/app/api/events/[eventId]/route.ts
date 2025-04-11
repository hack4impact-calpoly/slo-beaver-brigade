import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Event, { IEvent } from "@database/eventSchema";
import User from "@database/userSchema";
import { revalidateTag } from "next/cache";
import Log from "@database/logSchema";
import { IUser } from "@database/userSchema";
import { getUserDbData } from "app/lib/authentication";

type IParams = {
    params: {
        eventId: string;
    };
};

export async function GET(req: NextRequest, { params }: IParams) {
    await connectDB(); // connect to db
    const { eventId } = params;
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
    const { eventId } = params;
    let userData: IUser;

    try {
        const event = await Event.findByIdAndDelete(eventId).orFail();

        // Remove eventId from eventsRegistered and eventsAttended arrays of all users
        await User.updateMany(
            {},
            {
                $pull: {
                    eventsRegistered: { eventId: eventId },
                    eventsAttended: eventId,
                },
            }
        );
        
        const userRes = await getUserDbData();
        if(userRes) {
            userData = JSON.parse(userRes);
        } else {
            return NextResponse.json("Could not fetch user data. ", {
                status: 500,
            });
        }

        await Log.create({
            user: `${userData.firstName} ${userData.lastName}`,
            action: `deleted event ${event.eventName}`,
            date: new Date(),
            link: eventId,
        });

        revalidateTag("events");

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

/** add user to attendee id */
export async function PUT(req: NextRequest, { params }: IParams) {
    await connectDB(); // connect to db
    const { eventId } = params;
    const { userId } = await req.json();
    try {
        const event = await Event.findById(eventId).orFail();
        event.registeredIds.push(userId);
        await event.save();
        revalidateTag("events");
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
    const { eventId } = params;

    try {
        const event = await Event.findById(eventId).orFail();
        if (req.body) {
            const {
                eventName,
                location,
                eventType,
                eventImage,
                description,
                startTime,
                endTime,
                wheelchairAccessible,
                spanishSpeakingAccommodation,
                volunteerEvent,
                groupsAllowed,
                registeredIds,
                attendeeIds,
                groupsOnly,
                checklist,
            }: IEvent = await req.json();
            if (checklist !== undefined) {
                event.checklist = checklist;
            }
            if (location) {
                event.location = location;
            }
            if (eventName) {
                event.eventName = eventName;
            }
            if (eventImage) {
                event.eventImage = eventImage;
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
            if (wheelchairAccessible !== undefined) {
                event.wheelchairAccessible = wheelchairAccessible;
            }
            if (spanishSpeakingAccommodation !== undefined) {
                event.spanishSpeakingAccommodation =
                    spanishSpeakingAccommodation;
            }
            if (volunteerEvent) {
                event.volunteerEvent = volunteerEvent;
            }
            if (groupsAllowed) {
                event.groupsAllowed = groupsAllowed;
            }
            if (registeredIds) {
                event.registeredIds = registeredIds;
            }
            if (eventType) {
                event.eventType = eventType;
            }
            if (attendeeIds){
                event.attendeeIds = attendeeIds;
            }
            event.groupsOnly = groupsOnly;
        }
        await event.save();
        revalidateTag("events");
        return NextResponse.json("Event updated: " + event, { status: 200 });
    } catch (err) {
        console.error("Error updating event (EventId = " + eventId + "):", err);
        return NextResponse.json(
            "Event not updated (EventId = " + eventId + ") " + err,
            { status: 400 }
        );
    }
}
