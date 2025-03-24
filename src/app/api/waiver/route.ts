import connectDB from '@database/db';
import { NextResponse, NextRequest } from 'next/server';
import SignedWaiver from 'database/signedWaiverSchema';

export const revalidate = 0;
//Get waivers
export async function GET() {
  try {
    await connectDB();
    const waivers = await SignedWaiver.find({});
    return NextResponse.json({ waivers });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    // create a new waiver
    const newWaiver = new SignedWaiver(body);
    const savedWaiver = await newWaiver.save();
    return NextResponse.json({ _id: savedWaiver._id }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
