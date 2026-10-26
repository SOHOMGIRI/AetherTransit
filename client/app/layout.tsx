import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import CustomCursor from "@/components/layout/CustomCursor"
import { Toaster } from "sonner"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "AetherTransit — Real-Time Fleet Telemetry & Transit Intelligence",
  description:
    "AetherTransit delivers sub-second GPS tracking, predictive ML delay forecasts, and dynamic corridor navigation for smart campus transit.",
  keywords: ["AetherTransit", "fleet tracking", "campus bus tracking", "real-time GPS", "delay prediction", "STCET", "transit telemetry"],
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;1,6..72,400;1,6..72,600&family=JetBrains+Mono:wght@400;500;700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <CustomCursor />
        <Navbar />
        <Toaster
          position="top-right"
          theme="light"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              border: "1px solid #DDD7CB",
              color: "#1C1917",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            },
          }}
        />
        {children}
        <Footer />
      </body>
    </html>
  )
}
