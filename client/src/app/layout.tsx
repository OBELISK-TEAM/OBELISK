import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Obelisk",
  description: "Online Board for Effective Learning, Interaction and Sharing Knowledge",
  icons: [
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon/light-mode/favicon-48x48.png",
      sizes: "48x48",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      url: "/favicon/light-mode/favicon.svg",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "shortcut icon",
      url: "/favicon/light-mode/favicon.ico",
      media: "(prefers-color-scheme: light)",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon/dark-mode/favicon-48x48.png",
      sizes: "48x48",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "icon",
      type: "image/svg+xml",
      url: "/favicon/dark-mode/favicon.svg",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "shortcut icon",
      url: "/favicon/dark-mode/favicon.ico",
      media: "(prefers-color-scheme: dark)",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/favicon/dark-mode/apple-touch-icon.png",
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/favicon/light-mode/site.webmanifest" media="(prefers-color-scheme: light)" />
        <link rel="manifest" href="/favicon/dark-mode/site.webmanifest" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-title" content="Obelisk" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
