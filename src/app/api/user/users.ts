import connectDB from "@database/db";
import { NextResponse } from "next/server";
import User from "@database/userSchema";

// get endpoint to return array of all users
/**
 * @returns {allUsers: User[]} - array of all users in db
 */
export async function GET() {
  try {
    await connectDB();
    const allUsers = await User.find();
    return NextResponse.json({ allUsers });
  } catch (error) {
    console.error("error fetching the users", error);
  }
}