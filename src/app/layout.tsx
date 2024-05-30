import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider } from '@clerk/nextjs'
import "./styles/globals.css";
import Providers from "./Providers";
import NavbarParent from "@components/NavbarParents";
import { Lato, Montserrat } from "next/font/google";

//! Update metadata to match your project
export const metadata: Metadata = {
  title: "SLO Beaver Brigade",
  description: "Created with love.",
};


const montserrat = Montserrat({ subsets: ["latin"], weight: ["300"] });



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    
  return (
    <ClerkProvider>
      <html lang="en">

        <body  className={montserrat.className}>
                <Providers>
                    <NavbarParent/>
                    {children}
                    <SpeedInsights/>
                </Providers>
          </body>
      </html>
      </ClerkProvider>
  );
}
