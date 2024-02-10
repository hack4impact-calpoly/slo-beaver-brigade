"use client";

import { Button } from "@styles/Button";
import CreateEditEvent from "@components/CreateEditEvent";
import NextLink from "next/link";
import YourParentComponent from "@components/YourParentComponent";

export default function Home() {
  return (
    <main>
      <h1>SLO Beaver Brigade</h1>
      <Button>Nice Button</Button>
      <CreateEditEvent create={false}></CreateEditEvent>
      <NextLink href="/login">
        <Button>Login</Button>
      </NextLink>
      <YourParentComponent />
    </main>
  );
}
