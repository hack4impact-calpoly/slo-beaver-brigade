import React from "react";
import Navbar from "./Navbar";
import { currentUser } from "@clerk/nextjs";
import connectDB from "@database/db";
import User, {IUser} from "@database/userSchema";

/** fetch from MongoDB, ge\t user Role */
async function getUserRole(id: string | null){
  await connectDB()
  
  try{
    const user: IUser | null = await User.findById(id).orFail();
    return user;
  }
  catch(err){
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}

export default async function NavbarParent() {
  const user = await currentUser();
  
  if (!user) return <Navbar name="Sign In / Log In"></Navbar>;
  const dbuser = await getUserRole(user?.externalId)
  const name = `Hi ${user?.firstName}!`;

  if(dbuser){
    return <Navbar name={name}></Navbar>;
  }
  }

  
