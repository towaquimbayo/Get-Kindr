import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { inter, playfairDisplay } from "./fonts";
import Provider from "@/components/shared/provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const metadata = {
  title: "Get Kindr - Kindness is our currency",
  description:
    "Get Kindr is a hub that connects volunteers with non-profit organizations, and rewards them for their efforts. Join the community and start making a difference today!",
  metadataBase: new URL("https://getkindr.com"),
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session && session.user) {
    console.log(`User signed in with email: ${session.user.email}`);
  }
  return (
    <html lang="en" className="light">
      <body className={cx(inter.variable, playfairDisplay.variable)}>
        <Provider session={session}>
          {children}
          <Analytics />
        </Provider>
      </body>
    </html>
  );
}
