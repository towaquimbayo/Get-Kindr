import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import cx from "classnames";
import { inter, playfairDisplay } from "./fonts";
import Provider from "@/components/shared/provider";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  const session = await getServerSession(authOptions);
  if (session && session.user) {
    console.log(`User signed in with email: ${session.user.email}`);
  }
  return (
    <html lang="en" className="light">
      <Provider session={session}>
        <body className={cx(inter.variable, playfairDisplay.variable)}>
          {children}
          <Analytics />
        </body>
      </Provider>
    </html>
  );
}
