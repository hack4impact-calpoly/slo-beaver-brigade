import React from "react";
import Navbar from "./Navbar";
import { currentUser } from "@clerk/nextjs";

export default async function NavbarParent(props:{admin:boolean}) {
  const user = await currentUser();

  if (!user) return <Navbar name="Sign In / Log In" admin={props.admin}></Navbar>;

  const name = `Hi ${user?.firstName}!`;
  return <Navbar name={name} admin={props.admin}></Navbar>;
}
