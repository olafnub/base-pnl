import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import { WalletProvider } from "./context"

const inter = Inter({ subsets: ["latin"] });

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
      <WalletProvider>
      <body className={inter.className}>
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
    </html>
  );
}
