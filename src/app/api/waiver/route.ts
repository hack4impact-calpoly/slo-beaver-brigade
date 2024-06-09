import connectDB from "@database/db";
import User from "@database/userSchema";
import { NextResponse, NextRequest } from "next/server";
import Waiver, { IWaiver } from "@database/digitalWaiverSchema";

export const revalidate = 0;

//Get waivers
export async function GET() {
    try {
        await connectDB();
        const waivers = await Waiver.find({});
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
        const newWaiver = new Waiver(body);
        const savedWaiver = await newWaiver.save();
        return NextResponse.json({ _id: savedWaiver._id }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
