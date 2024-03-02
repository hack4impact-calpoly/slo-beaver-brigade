import React from "react"
import Navbar from "./Navbar"
import { currentUser } from "@clerk/nextjs";

export default async function NavbarParent(){
    const user = await currentUser();

    if (!user) return <Navbar name="SignIn/SignUp"></Navbar>;
 
    const name = `Hi ${user?.firstName}!`
    return <Navbar name={name} ></Navbar>;
}