import NextAuth, { Awaitable, NextAuthOptions } from "next-auth";
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
      authorization: {
        params: { prompt: "select_account" },
      },
      profile(profile, tokens): Awaitable<any> {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          accountType: "VOLUNTEER",
          volunteer: {
            create: {
              bio: "",
            },
          },
        };
      },
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
          console.error("Signin failed: Missing email or password");
          throw new Error("Please enter an email and password.");
        }

        const { email, password } = credentials;

        // Check if user exists
        const user = await prisma.user.findUnique({
          where: { email: email },
          include: {
            organization: true,
            volunteer: true,
          },
        });
        if (!user || !user.hashedPassword) {
          console.error(`Signin failed: User not found for email ${email}`);
          throw new Error("Incorrect email or password.");
        }

        // Check if password is valid
        const valid = await compare(password, user.hashedPassword);
        if (!valid) {
          console.error(`Signin failed: Incorrect password for email ${email}`);
          throw new Error("Incorrect email or password.");
        }

        console.log(`User ${email} signed in successfully.`);
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
    async jwt({ token, user, session, trigger, account }) {
      // console.log("JWT Callback: ", { token, user, session, trigger });

      // Trigger is used to update the token with new data
      if (trigger === "update" && session.name) {
        token.name = session.name;
      }


      if (user) {
        const userdata = await prisma.user.findUniqueOrThrow({
          where: {
            email: user.email as string,
          },
          include: {
            organization: true,
            volunteer: true,
          },
        });
        token.accountType = userdata.accountType;
        token.accountProvider = account ? account.provider : null;
        token.organizationID = userdata.organization ? userdata.organization.id : null;
        token.volunteerID = userdata.volunteer ? userdata.volunteer.id : null;
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
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
      // console.log("Session Callback: ", { session, token, user });

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          email: token.email,
          name: token.name,
        },
        accountType: token.accountType,
        accountProvider: token.accountProvider,
        organizationID: token.organizationID,
        volunteerID: token.volunteerID,
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 Days
    updateAge: 24 * 60 * 60, // 1 Day
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
