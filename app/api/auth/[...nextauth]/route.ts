import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Login request by user:", credentials);

        if (!credentials || !credentials.email || !credentials.password) {
          console.error("Missing required fields");
          throw new Error("Please enter an email and password");
        }

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) {
          console.error("User not found");
          throw new Error("User not found");
        }

        // Check if password is valid
        const valid = await compare(credentials.password, user.hashedPassword);
        if (!valid) {
          console.error("Incorrect password");
          throw new Error("Incorrect password");
        }

        console.log("User logged in:", user);
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("Sign In Callback: ", {
        user,
        account,
        profile,
        email,
        credentials,
      });

      // Check if this sign in callback is being called in the credentials authentication flow. If so, use the next-auth adapter to create a session entry in the database (SignIn is called after authorize so we can safely assume the user is valid and already authenticated).
      // if (
      //   req.query.nextauth.includes("callback") &&
      //   req.query.nextauth.includes("credentials") &&
      //   req.method === "POST"
      // ) {
      //   if (user) {
      //     const sessionToken = generateSessionToken();
      //     const sessionExpiry = fromDate(session.maxAge);

      //     await adapter.createSession({
      //       sessionToken: sessionToken,
      //       userId: user.id,
      //       expires: sessionExpiry,
      //     });

      //     const cookies = new Cookies(req, res);

      //     cookies.set("next-auth.session-token", sessionToken, {
      //       expires: sessionExpiry,
      //     });
      //   }
      // }

      return true;
    },
    async jwt({ token, user, session, trigger }) {
      console.log("JWT Callback: ", { token, user, session, trigger });

      // Trigger is used to update the token with new data
      if (trigger === "update" && session.name) {
        token.name = session.name;
      }

      if (user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          accountType: user.accountType,
        };
      }

      // Used to update the user token with new data
      // const newUser = await prisma.user.update({
      //   where: { id: token.id as string },
      //   data: { name: token.name },
      // });
      // console.log("New User", newUser);
      return token;
    },
    async session({ session, token, user }) {
      console.log("Session Callback: ", { session, token, user });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
          accountType: token.accountType,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
    updateAge: 24 * 60 * 60 // 1 Day
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
