
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
        console.log('clerk user not found')
        return null
    }
    // search db for user with matching email address
    console.log('revamp: fetching data')
    await connectDB()
    console.log(clerk_user.emailAddresses[0].emailAddress)
    try {
        const user: IUser= await User.findOne({ email: clerk_user.emailAddresses[0].emailAddress }).lean().orFail() as IUser;
        console.log("user found")
    
        return user
    }
    catch (err) {
        console.log('user not found: ' + err)
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

    console.log('fetching cookies');
    let res = cookies().get('user')?.value
    if (res) {
        console.log('returning cookies');
        const user = JSON.parse(res)
        return user as BareBoneIUser
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
        // else{
        //     user = await getUserDbDataRevamp()
        // }

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
        else{
            // manually check if user is logged in
            const temp = await currentUser()
            if (temp){
                // fetch user on mongo and set cookies
                const userRes = await getUserDataFromEmail(temp.emailAddresses[0].emailAddress)
                if (userRes){
                    await fetch("/api/user/cookies", {method: "POST", body: userRes})
                    const tempUser = JSON.parse(userRes) as IUser
                    if (tempUser){
                    if (tempUser?.role == "admin"){
                        return <NavbarAdmin name={name}></NavbarAdmin>
                        }
                    }
                    }

                
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
  
