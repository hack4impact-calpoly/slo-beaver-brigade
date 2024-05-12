import React from "react";
import Navbar from "./Navbar";
import { currentUser } from "@clerk/nextjs";
import connectDB from "@database/db";
import User, {IUser} from "@database/userSchema";
import NavbarAdmin from "./NavbarAdmin";
import { getUserDbData } from "app/lib/authentication";

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
  const user = await currentUser();
  
  if (!user) return <Navbar name="Sign In / Log In"></Navbar>;
  const name = `Hi ${user?.firstName}!`;
  const userRes = await getUserDbData()
    if (userRes){
        const user = JSON.parse(userRes)
        if (user?.role == "admin"){
        return <NavbarAdmin name={name}></NavbarAdmin>
        }
    }

    return <Navbar name={name}></Navbar>;
  }

  //process.env.DEV_MODE == "true" ||
  
