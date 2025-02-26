'use server'

import { currentUser } from "@clerk/nextjs/server";
import { BareBoneIUser } from "app/components/navbar/NavbarParents";
import connectDB from "database/db";
import User, { IUser } from "database/userSchema";
import { cookies } from "next/headers";

export async function getBareBoneUser() {
    let user = undefined;
    const clerk_user = await currentUser();
    if (!clerk_user){
        
        return null
    }
    // search db for user with matching email address
    
    await connectDB()
    
    try {
        const user: IUser = await User.findOne({ email: clerk_user.emailAddresses[0].emailAddress }, 'firstName, lastName, role').lean().orFail() as IUser;
        let stringuser = JSON.stringify(user)
        return stringuser
    }
    catch (err) {
        
        return null
    }
}

export async function removeUserCookie(){
    cookies().delete('user')
   
}