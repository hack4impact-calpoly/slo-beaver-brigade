import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "database/db";
import User, { IUser } from "database/userSchema";
import { NextResponse } from "next/server";

export async function GET() {
    const clerk_user = await currentUser();
    if (!clerk_user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    // search db for user with matching email address
    await connectDB();

    try {
        const user: IUser = await User.findOne({
            email: clerk_user.emailAddresses[0].emailAddress,
        }).orFail();

        return NextResponse.json(user);
    } catch (err) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
}
