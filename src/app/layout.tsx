import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import PageTransition from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Muhammad Farjad Ali Raza | Full-Stack Developer",
    template: "%s | Muhammad Farjad Ali Raza",
  },
  description:
    "Full-stack developer portfolio showcasing projects, skills, and blog posts on modern web development.",
  keywords: ["Full-Stack Developer", "Next.js", "React", "TypeScript", "Portfolio"],
  authors: [{ name: "Muhammad Farjad Ali Raza" }],
  creator: "Muhammad Farjad Ali Raza",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Muhammad Farjad Ali Raza",
    title: "Muhammad Farjad Ali Raza | Full-Stack Developer",
    description:
      "Full-stack developer portfolio showcasing projects, skills, and blog posts.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Farjad Ali Raza | Full-Stack Developer",
    description:
      "Full-stack developer portfolio showcasing projects, skills, and blog posts.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 dark:bg-gray-950 text-white dark:text-white`}
      >
        <ThemeProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </ThemeProvider>
      </body>
    </html>
  );
}
