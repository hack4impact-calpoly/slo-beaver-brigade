import connectDB from "@/database/db";
import Log from "@/database/logSchema";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";

// GET endpoint to fetch logs
export async function GET(req: NextRequest) {
    console.log(
        "Fetching logs on server, called by:",
        req.headers.get("referer")
    );
    try {
        await connectDB();

        const logs = await Log.find().sort({ date: -1 }).limit(50); // Limit to last 50 logs for performance

        console.log("Fetched logs:", logs);
        return NextResponse.json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch logs" },
            { status: 500 }
        );
    }
}
