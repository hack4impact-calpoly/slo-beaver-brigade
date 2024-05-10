import Event, { IEvent } from "database/eventSchema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    const ICAL = require("ical.js");

    try {
        const events: IEvent[] = await Event.find().orFail();

        const comp = new ICAL.Component(["vcalendar", [], []]);
        comp.updatePropertyWithValue("prodid", "SLO Beaver Brigade");
        comp.updatePropertyWithValue("version", "2.0"); // Add version for compatibility

        events.forEach((event) => {
            const vevent = new ICAL.Component("vevent");
            const dtstart = ICAL.Time.fromJSDate(event.startTime, false); // false to use local time
            const dtend = ICAL.Time.fromJSDate(event.endTime, false); // Adjust if time zone handling is needed

            vevent.updatePropertyWithValue("summary", event.eventName);
            vevent.updatePropertyWithValue("dtstart", dtstart);
            vevent.updatePropertyWithValue("dtend", dtend);
            vevent.updatePropertyWithValue("description", event.description);
            console.log(event);

            comp.addSubcomponent(vevent);
        });

        // Set correct headers for content type

        // Serialize and return the iCalendar data
        return new NextResponse(comp.toString());
    } catch {
        return NextResponse.json("Failed to get events", { status: 500 });
    }
}
