import connectDB from "database/db";
import User, { IUser } from "database/userSchema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// POST request for adding user
export async function POST(req: NextRequest) {
    try {
        const { firstName, lastName, role, id } = await req.json();

        if (!firstName || !lastName || !role || !id) {
            return NextResponse.json("Cookies failed to be set.", {
                status: 500,
            });
        }
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        cookies().set(
            "user",
            JSON.stringify({ firstName, lastName, role, _id: id }),
            { expires: expirationDate }
        );
    } catch (err) {
        return NextResponse.json("Cookies failed to be set.", { status: 500 });
    }
    return NextResponse.json("Cookies for user have been set.");
}
