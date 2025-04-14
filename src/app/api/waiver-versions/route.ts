import connectDB from "@database/db";
import { NextResponse, NextRequest } from "next/server";
import WaiverVersion from "database/waiverVersionsSchema";

export const revalidate = 0;

//get all waiver versions
export async function GET() {
  try {
    await connectDB();
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

    //field validation
    if (!body.version || !body.body || !body.acknowledgement) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newWaiverVersion = new WaiverVersion(body);
    const savedWaiverVersion = await newWaiverVersion.save();

    return NextResponse.json({ _id: savedWaiverVersion._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
