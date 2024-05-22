'use server'
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@database/db";
import User, { IUser } from "@database/userSchema";

export async function getUserDbData(){
    const clerk_user = await currentUser();
    if (!clerk_user){
        console.log('clerk user not found')
        return null
    }
    // search db for user with matching email address
    await connectDB()
    console.log(clerk_user.emailAddresses[0].emailAddress)
    try{
        const user: IUser  = await User.findOne({email: clerk_user.emailAddresses[0].emailAddress}).lean().orFail() as IUser;
        console.log("user found")
        return JSON.stringify(user);
    }
    catch(err){
        console.log('user not found: ' + err)
        return null
    }
}

export async function getUserDataFromEmail(email: string){
    // search db for user with matching email address
    await connectDB()
    console.log(email)
    try{
        const user: IUser = await User.findOne({email: email}).lean().orFail() as IUser;
        console.log("user found")
        return JSON.stringify(user);
    }
    catch(err){
        console.log('user not found: ' + err)
        return null
    }

}