import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@database/db";
import User, { IUser } from "@database/userSchema";
import { NextResponse, NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { clerkClient } from '@clerk/nextjs/server';
import { currentUser } from "@clerk/nextjs/server";
import { EmailAddress } from "@clerk/nextjs/server";

type IParams = {
    params: {
        userId: string;
    };
};


export async function PATCH(req: NextRequest, { params }: IParams) {
    const newEmail = await req.json();
    if (!newEmail) {
        return;
        // error - no group passed through
    }
    const userId = params.userId;


    try {




        const clerkUser = await currentUser();

        if (clerkUser == null) {
            return Response.json("Could not fetch user data. ", {
                status: 500,
            });
        }

        clerkClient.emailAddresses.updateEmailAddress(newEmail, {primary: true, verified: true});




        // UPDATE MONGODB
        return await User.updateOne(
            {user_id: userId},
            {email: newEmail},
        )



        

    } catch (err: any) {
        return Response.json(
            { error: (err as Error).message},
            { status: 500}
        )
    }





}