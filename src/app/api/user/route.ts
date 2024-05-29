import connectDB from "@database/db";
import { NextResponse, NextRequest } from "next/server";
import User, { IUser } from "@database/userSchema";
import { IEvent } from "@database/eventSchema";
import mongoose from "mongoose";
import { cookies } from "next/headers";

// GET request for getting all users
export async function GET() {
    try {
        await connectDB();
        const users = await User.find({}).lean().orFail();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

// POST request for adding user
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // convert the readable stream to JSON
        const bodyText = await new Response(req.body).text();
        const body: IUser = JSON.parse(bodyText);
        // create a new user
        const newUser = new User({
            ...body,
        });

        newUser.email = newUser.email.toLowerCase();

        const savedUser = await newUser.save();
        // save to cookies
        cookies().set(
            "user",
            JSON.stringify({
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                role: savedUser.role,
                id: savedUser._id,
            })
        );

        return NextResponse.json({ _id: savedUser._id }, { status: 200 });
    } catch (error) {
        console.log((error as Error).name);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
