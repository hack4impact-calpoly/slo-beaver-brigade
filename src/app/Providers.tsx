"use client";
import { ClerkProvider } from "@clerk/nextjs";
import StyledComponentsRegistry from "./lib/registry";
import { ChakraProvider } from "@chakra-ui/react";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    
    <ClerkProvider>
    <StyledComponentsRegistry>
      <ChakraProvider>
        {children}
      </ChakraProvider>
    </StyledComponentsRegistry>
    </ClerkProvider>
    
  )
}
