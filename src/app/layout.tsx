import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { NavbarActionsProvider } from "./components/NavbarActions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyHub - Kişisel Yaşam Organizatörü",
  description: "Şifre yöneticisi, günlük rutin takibi ve bütçe yönetimi için kişisel uygulama",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NavbarActionsProvider>
          <Navbar />
          <div className="pt-20">
            {children}
          </div>
        </NavbarActionsProvider>
      </body>
    </html>
  );
}
