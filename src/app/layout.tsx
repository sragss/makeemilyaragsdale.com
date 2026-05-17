import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Cormorant_Garamond, Inter } from "next/font/google";
import localFont from "next/font/local";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const eros = localFont({
  src: "../../public/Fonts/VJ-TYPE-EROS_trial/Eros-Regular_TRIAL.otf",
  variable: "--font-eros-src",
  display: "swap",
});

const edict = localFont({
  src: [
    {
      path: "../../public/Fonts/Edict Trial/EdictDisplayTrial-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Edict Trial/EdictDisplayTrial-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/Fonts/Edict Trial/EdictDisplayTrial-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/Fonts/Edict Trial/EdictDisplayTrial-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/Fonts/Edict Trial/EdictDisplayTrial-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-edict-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makeemilyaragsdale.com"),
  title: "Make Emily a Ragsdale",
  description:
    "Emily Devery & Sam Ragsdale. February 27, 2027. San Miguel de Allende, Mexico.",
  openGraph: {
    title: "Emily & Sam, February 27, 2027",
    description: "San Miguel de Allende, Mexico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${eros.variable} ${edict.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </body>
    </html>
  );
}
