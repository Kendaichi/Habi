import type { Metadata } from "next"
import { Fraunces, DM_Sans, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { RoleProvider } from "@/context/RoleContext"

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
})

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Habi — Circular Economy Marketplace",
  description: "Connecting waste suppliers, artisans, and buyers across Mindanao, Philippines.",
  icons: {
    icon: "/Habi_Logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  )
}
