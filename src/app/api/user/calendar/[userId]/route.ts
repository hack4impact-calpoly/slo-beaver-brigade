import Event, { IEvent } from "database/eventSchema";
import User, { IUser } from "database/userSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    const ICAL = require("ical.js");

    try {
        // get all events to corresponding user - all registered events
        const user: IUser = await User.findById(params.userId).orFail();
        const events: IEvent[] = await Promise.all(
            user.eventsRegistered.map((event) => {
                return Event.findById(event.eventId);
            })
        );

        const comp = new ICAL.Component(["vcalendar", [], []]);
        comp.updatePropertyWithValue("prodid", "SLO Beaver Brigade");
        comp.updatePropertyWithValue("version", "2.0"); // Add version for compatibility

        events.forEach((event) => {
            if (event) {
                const vevent = new ICAL.Component("vevent");
                const dtstart = ICAL.Time.fromJSDate(event.startTime, false); // false to use local time
                const dtend = ICAL.Time.fromJSDate(event.endTime, false); // Adjust if time zone handling is needed

                vevent.updatePropertyWithValue("summary", event.eventName);
                vevent.updatePropertyWithValue("dtstart", dtstart);
                vevent.updatePropertyWithValue("dtend", dtend);
                vevent.updatePropertyWithValue(
                    "description",
                    event.description
                );

                comp.addSubcomponent(vevent);
            }
        });

        // Set correct headers for content type

        const icsData = comp.toString();

        // Set headers for content type and to prompt file download
        const headers = new Headers({
            "Content-Type": "text/calendar",
            "Content-Disposition": `attachment; filename="user-calendar.ics"`,
        });

        return new NextResponse(icsData, { headers });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to get events" },
            { status: 500 }
        );
    }
}
