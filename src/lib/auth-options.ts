import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";
import User from "@/database/user.model";
import { compare, hash } from "bcrypt";

interface SessionUser {
  username: string;
  _id: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ username: credentials?.username });

        if (user) {
          const isPasswordValid = await compare(
            credentials?.password || "",
            user.password
          );

          if (isPasswordValid) {
            console.log(user);

            if (!user?.verified) return null;

            return user;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectToDatabase();
      const isExistingUser = await User.findOne({
        // @ts-ignore
        username: session.user?.username,
      });

      // @ts-ignore
      session.user = {
        _id: isExistingUser?._id,
        username: isExistingUser?.username,
      } as SessionUser;

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};