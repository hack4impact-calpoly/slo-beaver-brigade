"use client";
import { ClerkProvider } from "@clerk/nextjs";
import StyledComponentsRegistry from "./lib/registry";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../themes/theme"
import useSWR, { SWRConfig, Cache } from 'swr'

function localStorageProvider(cache: Readonly<Cache<any>>): Cache<any> {
    let map: Map<any, any> = new Map();

    if (typeof window !== "undefined" && window.localStorage) {
        const storedCache = localStorage.getItem('app-cache');
        if (storedCache) {
            map = new Map(JSON.parse(storedCache));
        }

        window.addEventListener('beforeunload', () => {
            const appCache = JSON.stringify(Array.from(map.entries()));
            localStorage.setItem('app-cache', appCache);
        });
    }

    return map;
}

const fetcher = (resource: string | URL | Request)=> fetch(resource, {cache: 'no-store'}).then(res => res.json())

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SWRConfig value={{fetcher: fetcher, keepPreviousData: true }}>
            <StyledComponentsRegistry>
                <ChakraProvider theme={theme}>
                    {children}
                </ChakraProvider>
            </StyledComponentsRegistry>
        </SWRConfig>
    )
}
