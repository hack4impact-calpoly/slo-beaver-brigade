import connectDB from "@database/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@database/userSchema";

// Dynamic GET request to get user by ID
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // id from url
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const userID = pathSegments[pathSegments.findIndex(segment => segment === 'users') + 1];

    // ensure userID is not empty
    if (!userID) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await User.findById(userID);

    // check if user exists
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 }); 
    
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}



