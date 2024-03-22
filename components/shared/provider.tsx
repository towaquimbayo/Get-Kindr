"use client";

import { NextUIProvider } from "@nextui-org/system";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

export default function Provider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <SessionProvider session={session}>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
}
