"use client";

import { SessionProvider } from "next-auth/react";

export default function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider
      session={session}
      // basePath="/"
      // refetchInterval={5 * 60}
      // refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}
