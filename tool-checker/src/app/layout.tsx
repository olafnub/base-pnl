import React from "react"
import NavBar from './components/NavBar'

export default function RootLayout({
    children,
} : {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <header>

            </header>
            <body>
                <NavBar />
                {children}
            </body>
            <footer>

            </footer>
        </html>
    )
}