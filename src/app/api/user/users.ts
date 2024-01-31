import connectDB from "@database/db";
import { NextResponse } from "next/server";
import User  from '@database/userSchema'
import userSchema from "@database/userSchema";

/**
 * @returns {allUsers: User[]}
 */
export async function GET() {
    try {
        await connectDB();
        const allUsers = await User.find();
        return NextResponse.json({ allUsers });
    } catch(error) { 
        console.error("error fetching the users", error)
    }
}

