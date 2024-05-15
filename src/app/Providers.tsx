"use client";
import { ClerkProvider } from "@clerk/nextjs";
import StyledComponentsRegistry from "./lib/registry";
import { ChakraProvider } from "@chakra-ui/react";
import  theme from "../themes/theme"
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    
    <StyledComponentsRegistry>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </StyledComponentsRegistry>
    
  )
}
