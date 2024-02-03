import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { inter, playfairDisplay } from "./fonts";
import Nav from "@/components/layout/nav";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "KINDR - Kindness is our currency",
  description:
    "KINDR is a hub that connects volunteers with non-profit organizations, and rewards them for their efforts. Join the community and start making a difference today!",
  metadataBase: new URL("https://precedent.dev"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(inter.variable, playfairDisplay.variable)}>
        <Nav />
        <main className="flex min-h-screen w-full flex-col items-center justify-center py-32">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
