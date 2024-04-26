'use server'
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@database/db";
import User, { IUser } from "@database/userSchema";

export async function getUserDbData(){
const clerk_user = await currentUser();
    if (!clerk_user){
        return null
    }
    // search db for user with matching email address
    await connectDB()
    console.log(clerk_user.emailAddresses[0].emailAddress)
    try{
        const user: IUser | null = await User.findOne({email: clerk_user.emailAddresses[0].emailAddress}).orFail();
        console.log("user found")
        return JSON.stringify(user);
    }
    catch(err){
        console.log('user not found')
        return null
    }
}