import { NextRequest, NextResponse } from "next/server";
import connectDB from "@database/db";
import Event, { IEvent } from "@database/eventSchema";

type IParams = {
    params: {
        eventType: string;
    };
};

export async function GET(req: NextRequest, { params }: IParams) {
    await connectDB(); // connect to db
    const { eventType } = params; // another destructure
    try {
        const eventTypes = await Event.distinct(eventType).orFail();
        return NextResponse.json(eventTypes);
    } catch (err) {
        return NextResponse.json(
            "Failed to fetch event types: " + err,
            { status: 404 }
        );
    }
}