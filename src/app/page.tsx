"use client";

import { Button } from "@styles/Button";
import CreateEditEvent from "@components/CreateEditEvent";
import NextLink from "next/link";

export default function Home() {
  return (
    <main>
      <h1>SLO Beaver Brigade</h1>
      <Button>Nice Button</Button>
      
      <NextLink href="/login">
        <Button>Login</Button>
      </NextLink>
    </main>
  );
}
