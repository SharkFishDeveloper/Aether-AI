import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";
import prisma from "@/util/db";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "repo read:user" }, // Needed for private repos
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "iamsecret",

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
      }

      if (profile) {
        token.username = profile.login;
        token.image = profile.avatar_url;

        // Fetch user from the database to get the discordId
        const user = await prisma.user.findUnique({
          where: { name: profile.login },
          select: { discordId: true },
        });

        token.discordId = user?.discordId || null; // Store discordId in token
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = {
        username: token.username as string,
        image: token.image as string,
        discordId: token.discordId as string, // Use the discordId from token
      };
      return session;
    },

    async signIn({ account, profile }) {
      console.log("Account details:", account);
      if (!account?.access_token) {
        console.error("No access token found");
        return false;
      }

      try {
        const installations = await fetch("https://api.github.com/user/installations", {
          method: "GET",
          headers: {
            Authorization: `token ${account.access_token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }).then((res) => res.json());

        if (!installations.installations || installations.installations.length === 0) {
          console.log("No GitHub Apps installed");
          return `https://github.com/apps/Aether-server/installations/new`;
        }

        // Upsert user in the database
        await prisma.user.upsert({
          where: { name: profile?.login },
          update: {
            avatar: profile?.avatar_url,
          },
          create: {
            name: profile?.login as string,
            avatar: profile?.avatar_url,
            discordId: null, // Initially set to null, user can link Discord later
          },
        });

      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }

      return true;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as POST, handler as GET };
