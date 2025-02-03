import connectDB from "@database/db";
import User, { IUser } from "@database/userSchema";
import { NextResponse, NextRequest } from "next/server";
import { revalidateTag } from "next/cache";

type IParams = {
    params: {
        userId: string;
    };
};
// Dynamic GET request to get user by ID
export async function GET(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        await connectDB();

        // grab id from param
        const id = params.userId;

        // search for user in db
        const user = await User.findById(id);

        // check if user exists
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { userId: string } }
) {
    try {
        await connectDB();

        // grab id from param
        const id = params.userId;

        // search for user in db
        const user = await User.findById(id);

        // check if user exists
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest, { params }: IParams) {
    await connectDB(); // Connect to the database

    const { userId } = params; // Destructure the userId from params

    try {
        const user = await User.findById(userId).orFail();
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const { eventsAttended }: IUser = await req.json();
        if (eventsAttended) {
            user.eventsAttended = eventsAttended;
        }
        await user.save();
        revalidateTag("users");
        return NextResponse.json("User updated: " + userId, { status: 200 });
    } catch (err) {
        console.error("Error updating user (UserId = " + userId + "):", err);
        return NextResponse.json(
            "User not updated (UserId = " + userId + ") " + err,
            { status: 400 }
        );
    }
}

export async function DELETE(req: NextRequest, {params}: IParams) {

    await connectDB(); // Connect to the database

    const { userId } = params; // Destructure the userId from params



    try {


        const user = await User.findByIdAndDelete(userId).orFail();


        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json("User deleted: " + userId, { status: 200 });


    } catch (err) {
        console.error("Error deleting user (UserId = " + userId + "):", err);
        return NextResponse.json(
            "User not deleted (UserId = " + userId + ") " + err,
            { status: 400 }
        );
    }



}
