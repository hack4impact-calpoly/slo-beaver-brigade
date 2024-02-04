import connectDB from "@database/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@database/userSchema";

// Dynamic GET request to get user by ID
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // extract id from the URL
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/");
    const userIDIndex =
      pathSegments.findIndex((segment) => segment === "user") + 1;
    const userID = pathSegments[userIDIndex];

    const user = await User.findById(userID);

    // Check if user exists
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
