import connectDB from "@/database/db";
import Log from "@/database/logSchema";
import { NextResponse } from "next/server";

// GET endpoint to fetch logs
export async function GET() {
  try {
    await connectDB();
    
    const logs = await Log.find()
      .sort({ date: -1 }) // Sort by newest first
      .limit(50); // Limit to last 50 logs for performance
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch logs" },
      { status: 500 }
    );
  }
}

// Helper function to create logs and add to db
export async function createLog(userId: string, action: string, linkId?: string) {
  try {
    await connectDB();
    
    const logEntry = new Log({
      user: userId,
      action: action,
      date: new Date(),
      link: linkId || null
    });
    
    await logEntry.save();
    return true;
  } catch (error) {
    console.error("Error creating log:", error);
    return false;
  }
}