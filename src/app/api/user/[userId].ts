import connectDB from "@database/db";
import { NextResponse } from "next/server";
import User, { IUser } from "@database/userSchema";

// get endpoint to get indivdual user
/**
 * @param {string} id - the ID of user we want
 * @returns {object} - user with specified ID
 */
export async function GET(id: string) {
  try {
    await connectDB();
    const user = await User.findById(id);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user", error);
    return new NextResponse("Error fetching user", { status: 500 });
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
