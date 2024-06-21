import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Imersão Full Stack && Full Cycle | Ticket Reservation System Web App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body
        className={`${inter.className} flex flex-col min-h-screen items-center bg-primary text-default`}
      >
        <div className="p-4 md:p-10 w-full max-w-[1256px]">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
