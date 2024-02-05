'use client'

import { Button } from "@styles/Button";
import { ChakraProvider } from '@chakra-ui/react'
import CreateEditEvent from "@components/CreateEditEvent";

export default function Home() {
  return (
      <main>
        <h1>SLO Beaver Brigade</h1>
        <Button>Nice Button</Button>
        <CreateEditEvent create={true}></CreateEditEvent>
      </main>    
  );
}
