
import React from "react";
import Navbar from "./Navbar";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@database/db";
import User, {IUser} from "@database/userSchema";
import NavbarAdmin from "./NavbarAdmin";
import { getUserDataFromEmail, getUserDbData } from "app/lib/authentication";
import { getBareBoneUser } from "app/actions/cookieactions";
import { cookies } from "next/headers";
import { getBaseUrl } from "app/lib/random";


export const getUserDbDataRevamp = async() => {

    const clerk_user = await currentUser();
    if (!clerk_user){
        return null
    }
    // search db for user with matching email address
    await connectDB()
    try {
        const user: IUser= await User.findOne({ email: clerk_user.emailAddresses[0].emailAddress }).lean().orFail() as IUser;
        return user
    }
    catch (err) {
        return null
    }
}

export type BareBoneIUser = {
    firstName: string,
    lastName: string,
    role: string
    _id: string
}

const getUserFromEmail = async (email: string) => {    // search db for user with matching email address
    await connectDB()
    
    try{
        const user: IUser = await User.findOne({email: email}).lean().orFail() as IUser;
        
        return user
    }
    catch(err){
        
        return null
    }

}

export function getUserCookie(){


    let res = cookies().get('user')?.value
    if (res) {
        const user = JSON.parse(res)
        return user as BareBoneIUser
    }
}



export default async function NavbarParent() {
    
    const user = await getUserDbDataRevamp()
    if (user){

        const name = `Hi ${user?.firstName}!`;
        if (user?.role == "admin" || user?.role == "super-admin"){
        return <NavbarAdmin name={name}></NavbarAdmin>
        }
        else{
            return <Navbar name={name}></Navbar>
        }
    }
    else{
        // manually check if user is logged in
        const temp = await currentUser()
        if (temp){
            // fetch user on mongo and set cookies
            const userRes = await getUserDataFromEmail(temp.emailAddresses[0].emailAddress)
            if (userRes){
                await fetch(getBaseUrl() + "/api/user/cookies", {method: "POST", body: userRes})
                const tempUser = JSON.parse(userRes) as IUser
                if (tempUser){
                    if (tempUser?.role == "admin" || tempUser?.role == "super-admin"){
                        return <NavbarAdmin name={`Hi ${tempUser.firstName}!`}></NavbarAdmin>
                        }
                    else{
                        return <Navbar name={`Hi ${tempUser.firstName}`}/>
                        }
                    }
                    
                }

            
        }
        else{
            return <Navbar name="Sign In / Log In"></Navbar>;
        }
    }
}

  //process.env.DEV_MODE == "true" ||
  
