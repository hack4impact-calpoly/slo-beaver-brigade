import connectDB from '@database/db';
import { NextResponse, NextRequest } from 'next/server';
import SignedWaiver from 'database/signedWaiverSchema';

// get waivers by event ID
export async function GET(
  request: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    await connectDB();
    const id = params.eventId;

    const waivers = await SignedWaiver.find({ eventId: id });

    if (waivers.length === 0) {
      return NextResponse.json({ error: 'No waivers found' }, { status: 404 });
    }

    return NextResponse.json(waivers);
  } catch (error) {
    console.error('Error fetching waivers:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

//update waiver by event ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { waiverId: string } }
) {
  try {
    await connectDB();
    const id = params.waiverId;

    const waivers = await SignedWaiver.find({ _id: id });

    if (waivers.length === 0) {
      return NextResponse.json({ error: 'No waivers found' }, { status: 404 });
    }

    const data = await request.json();

    const updatedWaiver = await SignedWaiver.findByIdAndUpdate(
      waivers[0]._id,
      data,
      { new: true }
    );

    return NextResponse.json(updatedWaiver);
  } catch (error) {
    console.error('Error updating waiver:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
