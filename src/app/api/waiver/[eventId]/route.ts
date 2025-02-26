import connectDB from "@database/db";
import { NextResponse, NextRequest } from "next/server";
import Waiver, { IWaiver } from "@database/digitalWaiverSchema";

// get waivers by event ID
export async function GET(
    request: NextRequest,
    { params }: { params: { eventId: string } }
) {
    try {
        await connectDB();
        const id = params.eventId;

        const waivers = await Waiver.find({ eventId: id });

        if (waivers.length === 0) {
            return NextResponse.json(
                { error: "No waivers found" },
                { status: 404 }
            );
        }

        return NextResponse.json(waivers);
    } catch (error) {
        console.error("Error fetching waivers:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
