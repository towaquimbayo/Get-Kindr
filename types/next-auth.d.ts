import NextAuth, { DefaultSession } from "next-auth";
import { AccountType, Organization, Volunteer } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | undefined | null;
      name: string | undefined | null;
    } & DefaultSession["user"];
    accountType: AccountType;
    organizationID: string | null;
    volunteerID: string | null;
  }

  interface User extends DefaultSession["user"] {
    accountType: AccountType;
    organization: Organization | null;
    volunteer: Volunteer | null;
  }
}
