
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
import { getUserDbDataRevamp } from "app/dashboard/page";

export const dynamic = "force-dynamic";
/** fetch from MongoDB, get user Role */
async function getUserData(id: string | null){
  await connectDB()
  
  try{
    const user: IUser | null = await User.findById(id).orFail();
    return user;
  }
  catch(err){
    return null
  }
}

export type BareBoneIUser = {
    firstName: string,
    lastName: string,
    role: string
}

const getUserFromEmail = async (email: string) => {    // search db for user with matching email address
    await connectDB()
    console.log(email)
    try{
        const user: IUser = await User.findOne({email: email}).lean().orFail() as IUser;
        console.log("user found")
        return user
    }
    catch(err){
        console.log('user not found: ' + err)
        return null
    }

}

export function getUserCookie(){
    let firstName = cookies().get('user_first_name')?.value;
    let lastName = cookies().get('user_last_name')?.value;
    let role = cookies().get('user_role')?.value;

    console.log('fetching cookies');

    if (firstName && lastName && role) {
        console.log('returning cookies');
        return {
            firstName,
            lastName,
            role
        } as BareBoneIUser;
    }
}



export default async function NavbarParent() {
    console.log('navbar: getting user')
    
    let user = null
    const res = getUserCookie()
    try{
        // getting user data
        if (res){
            user = res
        }
        else{
            user = await getUserDbDataRevamp()
        }

        console.log('navbar: user has been grabbed')
        console.log('user', user)
        
        if (!user) return <Navbar name="Sign In / Log In"></Navbar>;
        const name = `Hi ${user?.firstName}!`;
        console.log('navbar: getting user data')
        if (user){
            console.log('parsed user data')
            if (user?.role == "admin"){
            return <NavbarAdmin name={name}></NavbarAdmin>
            }
        }

        return <Navbar name={name}></Navbar>;
    }
    catch(err){
        console.log(err)
        return <Navbar name="Sign In / Log In"></Navbar>;

    }
  }

  //process.env.DEV_MODE == "true" ||
  
