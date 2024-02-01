import connectDB from "@database/db";
import { NextResponse } from "next/server";
import User from "@database/userSchema";

// dynamic GET request to get user by ID
export async function GET(id: string) {
    try {
        await connectDB();
        const user = await User.findById(id);

        // check for if user exsists
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}