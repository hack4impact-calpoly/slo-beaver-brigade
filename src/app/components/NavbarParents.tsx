'use client'
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { currentUser, useUser } from "@clerk/nextjs";
import connectDB from "@database/db";
import User, {IUser} from "@database/userSchema";
import NavbarAdmin from "./NavbarAdmin";
import { getUserDataFromEmail, getUserDbData } from "app/lib/authentication";



export default function NavbarParent() {
    const [userData, setUserData] = useState<IUser | null>(null)
    const {isLoaded,isSignedIn, user} = useUser()
    useEffect(() => {

        const fetchUser = async () => {
            if (user){
                await user.reload()
            }
        const userRes = await getUserDataFromEmail(user?.emailAddresses[0].emailAddress || "")
            if (userRes){
                const user = JSON.parse(userRes)
                console.log(user)
                setUserData(user)
            }
        }
        if (isSignedIn){
            setUserData(null)
            fetchUser()
        }
    }, [isSignedIn])

  
  if (!userData) return <Navbar name="Sign In / Log In"></Navbar>;
  const name = `Hi ${user?.firstName}!`;
  console.log(
    'user data', userData
  )
    if (userData){
        if (userData?.role == "admin"){
        return <NavbarAdmin name={name}></NavbarAdmin>
        }
    }

    return <Navbar name={name}></Navbar>;
  }

  //process.env.DEV_MODE == "true" ||
  
