'use client'
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { currentUser, useUser } from "@clerk/nextjs";
import connectDB from "@database/db";
import User, {IUser} from "@database/userSchema";
import NavbarAdmin from "./NavbarAdmin";
import { getUserDbData } from "app/lib/authentication";



export default function NavbarParent() {
    const [userData, setUserData] = useState<IUser | null>(null)
    const {isLoaded, user} = useUser()
    useEffect(() => {

        const fetchUser = async () => {
        const userRes = await getUserDbData()
            if (userRes){
                const user = JSON.parse(userRes)
                console.log(user)
                setUserData(user)
            }
        }
        fetchUser()
    }, [isLoaded])

  
  if (!user) return <Navbar name="Sign In / Log In"></Navbar>;
  const name = `Hi ${user?.firstName}!`;
    if (userData){
        if (userData?.role == "admin"){
        return <NavbarAdmin name={name}></NavbarAdmin>
        }
    }

    return <Navbar name={name}></Navbar>;
  }

  //process.env.DEV_MODE == "true" ||
  
