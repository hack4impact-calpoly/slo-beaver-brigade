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
  
      // convert the readable stream to JSON
      const bodyText = await new Response(req.body).text();
      const body = JSON.parse(bodyText);
      const { email, role, age, gender, eventsAttended, firstName, lastName } = body;
  
      // create a new user
      const newUser = new User({
        email,
        role,
        age,
        gender,
        eventsAttended,
        firstName,
        lastName,
        digitalWaiver: null
      });
  
      await newUser.save();
      return NextResponse.json({ newUser });

    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
          );
    }
  }