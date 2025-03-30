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

        // GET ID OF NEW EMAIL

        let newId;
        for (let i = 0; i<clerkUser.emailAddresses.length; i++) {
            if (newEmail == clerkUser.emailAddresses[i].emailAddress) {
                newId = clerkUser.emailAddresses[i].id;
            }
        }

        if (newId == null) {
            return Response.json("Could not fetch user data. ", {
                status: 500,
            });
        }

        const response = await clerkClient.emailAddresses.updateEmailAddress(newId, {primary: true, verified: true});

        console.log("test3");


        // UPDATE MONGODB
        await User.updateOne(
            {_id: userId},
            {email: newEmail},
        )

        return Response.json(response);



        

    } catch (err: any) {
        return Response.json(
            { error: (err as Error).message},
            { status: 500}
        )
    }





}