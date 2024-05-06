import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@database/db";
import Group, { IGroup } from "@database/groupSchema";

export async function GET() {
  await connectDB(); //connecting to the database

  try {
    const groups = await Group.find({});
    return NextResponse.json(groups);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch groups: " },
      {
        status: 400,
      }
    );
  }
}

export async function POST(req: NextRequest) {
  // Connect to the database
  await connectDB();
  console.log("Connected to DB");

  console.log("Request Body:", req.body);

  // Parse the incoming request body
  const groupData: IGroup = await req.json();

  // Create new group or return error
  try {
    const newGroup = new Group({
      group_name: groupData.group_name,
      groupees: groupData.groupees || [], // Default to empty if not provided
    });
    
    await newGroup.save();
    console.log("New Group Data:", newGroup);
    return NextResponse.json("Group added successfully: " + newGroup, {
        status: 200,
    });
  } catch (err: any) {
    console.error("Error creating group:", err);

    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((error: any) => error.message);
        return NextResponse.json({ message: "Validation error: " + errors.join(", ") }, {
            status: 400
        });
    } else {
        return NextResponse.json({ message: "Internal Server Error: " + err.message }, {
            status: 500  // Changed from 400 to 500 to correctly reflect server-side errors
        });
    }
}
}