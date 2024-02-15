import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string | undefined | null;
      name: string | undefined | null;
      // accountType: string | undefined | null;
    } & DefaultSession["user"];
  }
}
