"use client";
import StyledComponentsRegistry from "./lib/registry";
import { ChakraProvider } from '@chakra-ui/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    
    <StyledComponentsRegistry>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </StyledComponentsRegistry>
    
  )
}
