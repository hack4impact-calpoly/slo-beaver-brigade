'use server'

import { currentUser } from "@clerk/nextjs/server";
import { BareBoneIUser } from "app/components/NavbarParents";
import connectDB from "database/db";
import User, { IUser } from "database/userSchema";
import { cookies } from "next/headers";

export async function getBareBoneUser() {
    let user = undefined;
    const clerk_user = await currentUser();
    if (!clerk_user){
        console.log('clerk user not found')
        return null
    }
    // search db for user with matching email address
    console.log('revamp: fetching data')
    await connectDB()
    console.log(clerk_user.emailAddresses[0].emailAddress)
    try {
        const user: IUser = await User.findOne({ email: clerk_user.emailAddresses[0].emailAddress }, 'firstName, lastName, role').lean().orFail() as IUser;
        let stringuser = JSON.stringify(user)
        return stringuser
    }
    catch (err) {
        console.log('user not found: ' + err)
        return null
    }
}

export async function removeUserCookie(){
    cookies().delete('user_first_name')
    cookies().delete('user_last_name')
    cookies().delete('user_role')
}