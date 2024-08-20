import React from 'react';
import type { Metadata } from "next";
import "./globals.css";
import NavBar from "./components/NavBar";
import { WalletProvider } from "./context"
import Socials from "./components/Socials"
// import Head from "next/head"
// import Script from "next/script"

export const metadata: Metadata = {
  title: "Wallet Finance",
  description: "Keep Track of Your Crypto Finance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <Head> */}
      {/*  Google Tag Manager */}
        {/* <Script async src='https://www.googletagmanager.com/gtm.js?id='/> */}
          
        {/* <Script dangerouslySetInnerHTML={
          function(w: any,d: any,s: any,l: any,i: any){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.af+i+dl;f.parentNode.insertBefore(j,f);
            }(window,document,'script','dataLayer','GTM-WF7HQMKT');
        }/> */}
        {/* End Google Tag Manager */}
      {/* </Head> */}
      <WalletProvider>
      <body style={{height: "95vh"}}>
          <header>
            <NavBar /> 
          </header>
          <main>
            {children}
          </main>
          <footer>
          </footer>
      </body>
      </WalletProvider>
      <footer>
        <Socials />
      </footer>
    </html>
  );
}
