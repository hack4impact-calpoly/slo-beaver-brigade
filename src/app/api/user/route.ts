import connectDB from "@database/db";
import { NextResponse, NextRequest } from "next/server";
import User from "@database/userSchema";

// GET request for getting all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ users });
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

    // create an empty user
    const newUser = new User({});
    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
