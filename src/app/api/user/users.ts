import connectDB from "@database/db";
import { NextResponse } from "next/server";
import User, { IUser } from "@database/userSchema";

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

// put endpoint to upload user to mongoDB
/**
 * @param {object} data - user object to put in db
 * @return {object} - object that was uploaded to db
 */
export async function PUT(data: IUser) {
  try {
    await connectDB();
    const newUser = await User.create(data);
    return NextResponse.json({ newUser });
  } catch (error) {
    console.error("error adding user", error);
  }
}
