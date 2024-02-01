"use client";
import { ChakraProvider } from "@chakra-ui/react";
import StyledComponentsRegistry from "./lib/registry";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    
    <StyledComponentsRegistry>
        <ChakraProvider>
            {children}
        </ChakraProvider>
    </StyledComponentsRegistry>
    
  )
}
