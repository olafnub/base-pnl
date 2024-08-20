import React from 'react';
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import { WalletProvider } from "./context"
import Socials from "./components/Socials"
import Script from "next/script"

export const metadata: Metadata = {
  title: "Wallet Discover",
  description: "Keep Track of Your Crypto Finance",
};

const GOOGLE_KEY = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>

        {/* website icon from https://www.flaticon.com/authors/edtim */}

      {/* <!-- Google tag (gtag.js) --> */}
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=G-${GOOGLE_KEY}`}></Script>
        <Script id="google-analytics" strategy="afterInteractive">
          {
            `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-${GOOGLE_KEY}');
            `
          }
        </Script>
      </head>
      <WalletProvider>
      <body className="h-screen">
          <header>
            <NavBar /> 
          </header>
          <main>
            {children}
          </main>
          <footer className="place-content-end">
            <Socials />
          </footer>
      </body>
      </WalletProvider>
    </html>
  );
}
