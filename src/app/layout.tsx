import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import Providers from "./Providers";
import NavbarParent from "@components/NavbarParents";
import { Lato } from "next/font/google";
import { useRouter } from "next/navigation";

//! Update metadata to match your project
export const metadata: Metadata = {
  title: "SLO Beaver Brigade",
  description: "Created with love.",
};

const lato = Lato({
  weight: '400',
  subsets: ['latin'],
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
        <body  className={lato.className}>
          <Providers>
              <NavbarParent/>
              {children}
          </Providers>
          </body>
      </html>
  );
}
