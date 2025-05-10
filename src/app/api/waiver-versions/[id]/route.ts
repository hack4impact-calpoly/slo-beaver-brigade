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

    // Validate required fields
    if (!body.body || !body.acknowledgement) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updateData = {
      body: body.body,
      acknowledgement: body.acknowledgement,
      isActiveWaiver: body.isActiveWaiver,
    };

    if (body.isActiveWaiver) {
      await WaiverVersion.updateMany(
        { _id: { $ne: id } },
        { $set: { isActiveWaiver: false } }
      );
    }

    const updatedWaiverVersion = await WaiverVersion.findByIdAndUpdate(
      id,
      updateData,
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

    const waiverToDelete = await WaiverVersion.findById(id);
    if (!waiverToDelete) {
      return NextResponse.json(
        { error: "Waiver version not found" },
        { status: 404 }
      );
    }

    if (waiverToDelete.isActiveWaiver) {
      return NextResponse.json(
        { error: "Cannot delete the active waiver version" },
        { status: 400 }
      );
    }

    const deletedWaiverVersion = await WaiverVersion.findByIdAndDelete(id);

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
