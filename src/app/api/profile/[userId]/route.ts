import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@database/db'; 
import User, { IUser } from '@database/userSchema';
import { NextResponse, NextRequest } from "next/server";
import { revalidateTag } from "next/cache";


type IParams = {
    params: {
        userId: string;
    };
};


export async function PATCH(req: NextRequest, { params }: IParams) {
    await connectDB(); 
    const { userId } = params;

    try {
        const user = await User.findById(userId).orFail();
        if (req.body) {
            console.log(req.body);
            const {
                firstName,
                lastName,
                email,
                phoneNumber,
                receiveNewsletter,
                zipcode
            }: IUser = await req.json()
            if (firstName) {
                user.firstName = firstName;
            }
            if (lastName) {
                user.lastName = lastName;
            }
            if (email) {
                user.email = email;
            }
            if (phoneNumber) {
                user.phoneNumber = phoneNumber;
            }
            if (zipcode) {
                user.zipcode = zipcode
            }
            user.receiveNewsletter = receiveNewsletter;
            
        }
        await user.save();
        revalidateTag("events");
        return NextResponse.json("User updated: " + user, { status: 200 });
    } catch (err) {
        console.error("Error updating event (UserId = " + userId + "):", err);
        return NextResponse.json(
            "User not updated (UserId = " + userId + ") " + err,
            { status: 400 }
        );
    }
}
     
