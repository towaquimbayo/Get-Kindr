'use client';

import React from "react";
import { useSession } from "next-auth/react";

export default function Profile() {
  const { data: session, status, update } = useSession();
  return (
    <div>
      <h1>My Account</h1>
      {session && session.user && (
        <p>Hello {session.user?.name}</p>
      )}
    </div>
  );
}
