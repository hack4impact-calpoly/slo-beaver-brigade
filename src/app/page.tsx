"use client";

import { Button } from "@styles/Button";
import { ChakraProvider } from "@chakra-ui/react";
import CreateEditEvent from "@components/CreateEditEvent";
import NextLink from "next/link";

export default function Home() {
  return (
    <main>
      <h1>SLO Beaver Brigade</h1>
      <Button>Nice Button</Button>
      <CreateEditEvent create={false}></CreateEditEvent>
      <NextLink href="/login">
        <Button>Login</Button>
      </NextLink>
    </main>
  );
}
