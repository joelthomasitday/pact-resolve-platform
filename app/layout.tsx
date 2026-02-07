import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "@/components/navbar"
import { WhatsAppButton } from "@/components/whatsapp-button"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

  export const metadata: Metadata = {
  title: "PACT | Professional Mediation Platform for Dispute Resolution",
  description:
    "PACT is a neutral, professional mediation platform helping individuals, businesses, and institutions resolve conflicts faster, fairly, and confidentially. 2500+ cases resolved with 98% success rate.",
  keywords:
    "mediation, dispute resolution, conflict resolution, business mediation, family mediation, workplace mediation",
  generator: "v0.app",
  icons: {
    icon: "/images/pact-logo.png",
    apple: "/images/pact-logo.png",
  },
  openGraph: {
    title: "PACT | Professional Mediation Platform",
    description: "Resolve disputes confidently and preserve relationships with PACT mediation services.",
    url: "https://pact-mediation.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PACT | Professional Mediation Platform",
    description: "Resolve disputes confidently and preserve relationships with PACT.",
  },
}

import { getGlobalSettings } from "@/lib/strapi"
import { Footer } from "@/components/footer"

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let globalSettings = null;
  try {
    globalSettings = await getGlobalSettings();
  } catch (error) {
    console.error('Failed to load global settings from Strapi:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#1e3a5f" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={`font-sans antialiased text-foreground bg-background`}>
        <Navbar globalSettings={globalSettings} />
        {children}
        <Footer globalSettings={globalSettings} />
        <WhatsAppButton floating phoneNumber={globalSettings?.whatsapp} />
        <Analytics />
      </body>
    </html>
  )
}
