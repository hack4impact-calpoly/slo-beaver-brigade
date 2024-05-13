// 'use client'
// import React, { useEffect, useState } from "react";
// import Navbar from "./Navbar";
// import { currentUser, useUser } from "@clerk/nextjs";
// import connectDB from "@database/db";
// import User, {IUser} from "@database/userSchema";
// import NavbarAdmin from "./NavbarAdmin";
// import { getUserDataFromEmail, getUserDbData } from "app/lib/authentication";



// export default function NavbarParent() {
//     const [userData, setUserData] = useState<IUser | null>(null)
//     const {isLoaded,isSignedIn, user} = useUser()
//     useEffect(() => {

//         const fetchUser = async () => {
//             if (user){
//                 await user.reload()
//             }
//         const userRes = await getUserDataFromEmail(user?.emailAddresses[0].emailAddress || "")
//             if (userRes){
//                 const user = JSON.parse(userRes)
//                 console.log(user)
//                 setUserData(user)
//             }
//         }
//         setUserData(null)
//         if (isSignedIn){
//             fetchUser()
//         }
//     }, [isSignedIn, isLoaded])

  
//   if (!userData && !isSignedIn) return <Navbar name="Sign In / Log In"></Navbar>;
//   const name = `Hi ${user?.firstName}!`;
//   console.log(
//     'user data', userData, isSignedIn, isLoaded
//   )
//     if (userData){
//         if (userData?.role == "admin"){
//         return <NavbarAdmin name={name}></NavbarAdmin>
//         }
//     }

//     return <Navbar name={name}></Navbar>;
//   }

//   //process.env.DEV_MODE == "true" ||
  
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { currentUser } from "@clerk/nextjs";
import connectDB from "@database/db";
import User, { IUser } from "@database/userSchema";
import NavbarAdmin from "./NavbarAdmin";
import { getUserDbData } from "app/lib/authentication";

export const dynamic = "force-dynamic";

export default async function NavbarParent() {
  const user = await currentUser();

  if (!user) return <Navbar name="Sign In / Log In"></Navbar>;

  const name = `Hi ${user?.firstName}!`;

  // Assuming getUserDbData fetches the user role asynchronously
  getUserDbData().then((userRes) => {
    if (userRes) {
      const user = JSON.parse(userRes);
      if (user?.role === "admin") {
        return <NavbarAdmin name={name}></NavbarAdmin>;
      }
    }
  });

  return <Navbar name={name}></Navbar>;
}