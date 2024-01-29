import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KINDR",
  description: "Discover KINDR: Empowering socially conscious individuals to make a positive impact through flexible volunteering opportunities. Join our ethical side hustle and be part of a culture of kindness and generosity. Spark a ripple of positive change in your community and beyond.",
};

export default function RootLayout({  children }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        {children}  
      </body>
    </html>
  );
}
