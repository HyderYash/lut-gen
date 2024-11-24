import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import TanStackProvider from "./components/providers/TanStackProvider"
import AuthProvider from "./components/providers/AuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LUT Builder - Color Grading Tool",
  description: "LUT Builder - Color Grading Tool",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <TanStackProvider>{children}</TanStackProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
