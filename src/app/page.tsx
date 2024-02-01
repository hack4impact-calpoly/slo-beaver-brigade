'use client'

import { Button } from "@styles/Button";
import { ChakraProvider } from '@chakra-ui/react'

export default function Home() {
  return (
    <ChakraProvider>
      <main>
        <h1>SLO Beaver Brigade</h1>
        <Button>Nice Button</Button>
      </main>    
    </ChakraProvider>
  );
}
