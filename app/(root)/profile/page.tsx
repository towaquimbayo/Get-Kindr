"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || status !== "authenticated") router.push("/login");
  }, [session, status, router]);

  return (
    <div>
      <h1>My Account</h1>
      {session && session.user && (
        <p>
          Hello {session.user?.name}, {session.user.accountType}
        </p>
      )}
    </div>
  );
}
