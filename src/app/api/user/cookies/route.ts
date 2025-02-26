import { currentUser } from "@clerk/nextjs/server";
import { BareBoneIUser } from "app/components/navbar/NavbarParents";
import connectDB from "database/db";
import User, { IUser } from "database/userSchema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

// setting cookies
export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, role, _id } = await req.json();

        if (!firstName || !lastName || !role || !_id) {
            return NextResponse.json("Cookies failed to be set.", {
                status: 500,
            });
        }
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        cookies().set(
            "user",
            JSON.stringify({ firstName, lastName, role, _id }),
            { expires: expirationDate }
        );
    } catch (err) {
        return NextResponse.json("Cookies failed to be set.", { status: 500 });
    }
    return NextResponse.json("Cookies for user have been set.");
}

export async function GET() {
    try {
        let userCookie = cookies().get("user");

        if (userCookie) {
            return NextResponse.json(userCookie.value);
        }

        const clerk_user = await currentUser();

        if (!clerk_user) {
            console.error("Clerk user not found.");
            return NextResponse.json(
                { error: "Failed to get user." },
                { status: 500 }
            );
        }

        await connectDB();
        const user = await User.findOne(
            { email: clerk_user.emailAddresses[0].emailAddress },
            "firstName lastName role"
        ).lean();

        if (!user) {
            console.error("User not found in database.");
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("An error occurred:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
