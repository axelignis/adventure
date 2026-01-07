import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Aventura Marketplace - Experiencias de Turismo Aventura en Chile",
    template: "%s | Aventura Marketplace",
  },
  description:
    "Descubre y reserva experiencias de turismo aventura en Chile: kayak, rafting, trekking, pesca y más. Conecta con guías certificados y vive la aventura.",
  keywords: [
    "turismo aventura",
    "chile",
    "kayak",
    "rafting",
    "trekking",
    "pesca",
    "montañismo",
    "experiencias",
  ],
  authors: [{ name: "Aventura Marketplace" }],
  creator: "Aventura Marketplace",
  openGraph: {
    type: "website",
    locale: "es_CL",
    alternateLocale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Aventura Marketplace",
    title: "Aventura Marketplace - Turismo Aventura en Chile",
    description:
      "Descubre y reserva experiencias de turismo aventura en Chile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aventura Marketplace",
    description: "Experiencias de turismo aventura en Chile",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
