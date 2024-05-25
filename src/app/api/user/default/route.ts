import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "database/db";
import User, { IUser } from "database/userSchema";
import { NextResponse } from "next/server";

export async function GET() {
    const clerk_user = await currentUser();
    if (!clerk_user) {
        console.log("clerk user not found");
        return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
    // search db for user with matching email address
    await connectDB();
    console.log(clerk_user.emailAddresses[0].emailAddress);
    try {
        const user: IUser = await User.findOne({
            email: clerk_user.emailAddresses[0].emailAddress,
        }).orFail();
        console.log("user found");
        return NextResponse.json(user);
    } catch (err) {
        console.log("user not found: " + err);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
}
