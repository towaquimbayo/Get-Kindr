import NextAuth, { DefaultSession } from "next-auth";
import { AccountType } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | undefined | null;
      name: string | undefined | null;
    } & DefaultSession["user"];
    accountType: AccountType;
  }

  interface User extends DefaultSession["user"] {
    accountType: AccountType;
  }
}
