import type { Metadata } from "next";
import { Carlito, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Terra Energy",
  description: "Plataforma de gestión energética",
};

// Carlito es una alternativa libre a Calibri (mismas métricas)
const calibri = Carlito({
  weight: ["400", "700"],
  variable: "--font-calibri",
  display: "swap",
  subsets: ["latin"],
});

// Inter Bold como alternativa a Arial Black para el logo
const arialBlack = Inter({
  weight: ["900"],
  variable: "--font-arial-black",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${calibri.variable} ${arialBlack.variable} ${calibri.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
