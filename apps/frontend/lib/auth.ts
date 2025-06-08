import GoogleProvider from "next-auth/providers/google";

import { DefaultSession, NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

// const prisma = new PrismaClient();

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log(user);

      try {
        // check user in db
        // add the user to db
        const userId = "1";
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/v1/user/login`, {
          userId,
        });
        user.id = userId;
      } catch (error) {
        console.error("Error", error);
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token.email;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
