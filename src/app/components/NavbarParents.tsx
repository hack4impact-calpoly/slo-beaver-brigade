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
