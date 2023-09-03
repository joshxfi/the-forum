/* eslint-disable no-param-reassign */
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthedUser } from "../../authorize/types";

const handler = NextAuth({
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/authorize`, {
          method: "POST",
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        if (res.ok) {
          const user = (await res.json()) as AuthedUser;
          return user;
        }

        return Promise.reject(new Error("Invalid credentials"));
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }: any) {
      if (user) {
        token.username = user.username;
        return token;
      }
      return token;
    },
    session({ session, token }: any) {
      if (session.user) {
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
