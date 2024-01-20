import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";

//! Update metadata to match your project
export const metadata: Metadata = {
  title: "SLO Beaver Brigade",
  description: "Created with love.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
            {children}
        </Providers>
        </body>
    </html>
  );
}
