import connectDB from "@/database/db";
import Log from "@/database/logSchema";
import { NextRequest, NextResponse } from "next/server";

// GET endpoint to fetch logs
export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const logs = await Log.find().sort({ date: -1 }).limit(50); // Limit to last 50 logs for performance

        return NextResponse.json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        return NextResponse.json(
            { error: "Failed to fetch logs" },
            { status: 500 }
        );
    }
}

// POST endpoint to create a new log
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const newLog = await Log.create(req.body);

        return NextResponse.json(newLog, { status: 201 });
    } catch (error) {
        console.error("Error creating log:", error);
        return NextResponse.json(
            { error: "Failed to create log" },
            { status: 500 }
        );
    }
}
