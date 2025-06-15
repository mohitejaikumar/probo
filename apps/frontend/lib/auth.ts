import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultSession, NextAuthOptions, Session } from "next-auth";
import jwt from "jsonwebtoken";
import prisma from "@repo/db";
import bcrypt from "bcrypt";
import axios from "axios";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    jwtToken: string;
  }
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      jwtToken: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    jwtToken: string;
  }
}

async function getjwtToken(userId: string): Promise<string> {
  const jwtToken = await jwt.sign(
    {
      id: userId,
    },
    process.env.NEXTAUTH_SECRET!,
    {
      expiresIn: 24 * 60 * 60 * 365,
    }
  );
  return jwtToken;
}

async function checkUserInDb(userEmail: string) {
  let user = await prisma.user.findFirst({
    where: {
      email: userEmail,
    },
  });
  return user;
}

async function addUserToDb(
  userEmail: string,
  userPassword: string,
  provider: string
) {
  const hashedPassword = await bcrypt.hash(userPassword, 10);
  let user = await prisma.user.create({
    data: {
      email: userEmail,
      password: hashedPassword,
      balance: 100000,
      lockedBalance: 0,
      provider,
    },
  });
  return user;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",

      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "password", type: "password" },
      },
      // @ts-ignore
      async authorize(credentials, req) {
        if (credentials === undefined) {
          return null;
        }

        const userEmail = credentials.email;
        const userPassword = credentials.password;

        console.log(userEmail, userPassword);

        if (!userEmail || !userPassword) {
          return null;
        }

        try {
          let user = await checkUserInDb(userEmail);
          if (!user) {
            user = await addUserToDb(userEmail, userPassword, "credentials");
          } else {
            const isUserValid = await bcrypt.compare(
              userPassword,
              user.password
            );
            if (!isUserValid) return null;
          }
          const jwtToken = await getjwtToken(user.id);

          return {
            id: user.id,
            email: user.email,
            jwtToken: jwtToken,
          };
        } catch (err) {
          console.error(err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log(user);

      if (account?.provider === "google") {
        try {
          let dbUser = await checkUserInDb(user.email);
          if (!dbUser) {
            dbUser = await addUserToDb(user.email, "", "google");
          }
          user.id = dbUser.id;
          user.jwtToken = await getjwtToken(user.id);
        } catch (error) {
          console.error("Error", error);
          return false;
        }
      } else {
        console.log("credential called");
      }

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/v1/user/login`,
          {
            userId: user.id,
            jwtToken: user.jwtToken,
          },
          {
            headers: {
              Authorization: "Bearer " + user.jwtToken,
            },
          }
        );
      } catch (err) {
        console.log(err);
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.id = user.id;
        token.jwtToken = user.jwtToken;
      }
      return token;
    },
    async session({ session, token }) {
      const newSession = session;
      if (token) {
        newSession.user.email = token.email;
        newSession.user.id = token.id;
        newSession.user.jwtToken = token.jwtToken;
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
