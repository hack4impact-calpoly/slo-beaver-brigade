import connectDB from "@database/db";
import { NextResponse, NextRequest } from "next/server";
import WaiverVersion from "database/waiverVersionsSchema";

//get a specific waiver version by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;

    const waiverVersion = await WaiverVersion.findById(id);

    if (!waiverVersion) {
      return NextResponse.json(
        { error: "Waiver version not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(waiverVersion);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

//update a specific waiver version
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;
    const body = await request.json();

    const updatedWaiverVersion = await WaiverVersion.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updatedWaiverVersion) {
      return NextResponse.json(
        { error: "Waiver version not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedWaiverVersion);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

//delete a specific waiver version
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const id = params.id;

    const deletedWaiverVersion = await WaiverVersion.findByIdAndDelete(id);

    if (!deletedWaiverVersion) {
      return NextResponse.json(
        { error: "Waiver version not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Waiver version deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
