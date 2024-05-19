
import React from "react";
import Navbar from "./Navbar";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@database/db";
import User, {IUser} from "@database/userSchema";
import NavbarAdmin from "./NavbarAdmin";
import { getUserDataFromEmail, getUserDbData } from "app/lib/authentication";
import { getUserFromEmail } from "app/actions/userapi";

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

export default async function NavbarParent() {
    console.log('navbar: getting user')
  const user = await currentUser();
  console.log('navbar: user has been grabbed')
  
  if (!user) return <Navbar name="Sign In / Log In"></Navbar>;
  const name = `Hi ${user?.firstName}!`;
  console.log('navbar: getting user data')
  const userRes = await getUserDataFromEmail(user.emailAddresses[0].emailAddress)
    if (userRes){
        const user = JSON.parse(userRes)
        console.log('parsed user data')
        if (user?.role == "admin"){
        return <NavbarAdmin name={name}></NavbarAdmin>
        }
    }

    return <Navbar name={name}></Navbar>;
  }

  //process.env.DEV_MODE == "true" ||
  
