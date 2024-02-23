"use client";

import { Button } from "@styles/Button";
import NextLink from "next/link";
import YourParentComponent from "@components/YourParentComponent";
import { SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main>
      <h1>SLO Beaver Brigade</h1>
      <Button>Nice Button</Button>
      
      <NextLink href="/login">
        <Button>Login</Button>
      </NextLink>
      < SignOutButton />
      <YourParentComponent />
    </main>
  );
}
