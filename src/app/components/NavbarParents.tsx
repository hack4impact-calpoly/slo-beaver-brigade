import React from "react";
import Navbar from "./Navbar";
import { currentUser } from "@clerk/nextjs";
import connectDB from "@database/db";
import User, {IUser} from "@database/userSchema";
import NavbarAdmin from "./NavbarAdmin";

/** fetch from MongoDB, get user Role */
async function getUserRole(id: string | null){
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
  const dbId: string | null = user?.unsafeMetadata["dbId"] as string
  const dbuser = await getUserRole(dbId)
  const name = `Hi ${user?.firstName}!`;

    if(dbuser?.role == "admin"){
        // get user role
        return <NavbarAdmin name={name}></NavbarAdmin>
    }

    return <Navbar name={name}></Navbar>;
  }

  
