import connectDB from "@database/db";
import { NextResponse } from "next/server";
import User, { IUser } from "@database/userSchema";

export async function GET() {
  await connectDB();
  try {
    const users = await User.find({});
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
