import connectDB from "@database/db";
import { NextResponse, NextRequest } from "next/server";
import WaiverVersion from "database/waiverVersionsSchema";

export const revalidate = 0;

//get all waiver versions
export async function GET() {
  try {
    await connectDB();

    // Update existing waivers that don't have isActiveWaiver field
    await WaiverVersion.updateMany(
      { isActiveWaiver: { $exists: false } },
      { $set: { isActiveWaiver: false } }
    );

    const waiverVersions = await WaiverVersion.find({});
    return NextResponse.json({ waiverVersions });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

//create a new waiver version
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log("Received POST request with body:", body);

    //field validation
    if (!body.version || !body.body || !body.acknowledgement) {
      console.log("Missing required fields:", {
        version: !body.version,
        body: !body.body,
        acknowledgement: !body.acknowledgement,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const waiverCount = await WaiverVersion.countDocuments();
    const isActive = waiverCount === 0;

    const newWaiverVersion = new WaiverVersion({
      version: body.version,
      body: body.body,
      acknowledgement: body.acknowledgement,
      dateCreated: new Date(),
      isActiveWaiver: isActive,
    });

    console.log("Creating new waiver version:", newWaiverVersion);
    const savedWaiverVersion = await newWaiverVersion.save();
    console.log("Saved waiver version:", savedWaiverVersion);

    return NextResponse.json(savedWaiverVersion, { status: 201 });
  } catch (error) {
    console.error("Error saving waiver version:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
